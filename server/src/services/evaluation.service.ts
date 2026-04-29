import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { evaluationsTable, criteriaTable, documentsTable, submissionsTable } from "../schema";
import { NotFound } from "../utils/errors";
import { logAudit } from "./audit.service";
import { setSubmissionStatus, setSubmissionConfidence } from "./submission.service";

type CriterionRow = typeof criteriaTable.$inferSelect;
type DocumentRow = typeof documentsTable.$inferSelect;

export async function evaluateSubmission(submissionId: string, actor: string) {
  const [submission] = await db.select().from(submissionsTable).where(eq(submissionsTable.id, submissionId)).limit(1);
  if (!submission) throw NotFound("Submission not found");

  const criteria = await db.select().from(criteriaTable).where(eq(criteriaTable.tenderId, submission.tenderId));
  const docs = await db.select().from(documentsTable).where(eq(documentsTable.submissionId, submissionId));

  // wipe prior evaluations for this submission so re-eval is idempotent
  await db.delete(evaluationsTable).where(eq(evaluationsTable.submissionId, submissionId));

  const results: Array<typeof evaluationsTable.$inferSelect> = [];
  let mandatoryFailed = false;
  let needsReview = false;
  const confidences: number[] = [];

  for (const c of criteria) {
    const result = applyRule(c, docs);
    confidences.push(result.confidence);

    if (result.status === "fail" && c.mandatory) mandatoryFailed = true;
    if (result.status === "review") needsReview = true;

    const [row] = await db
      .insert(evaluationsTable)
      .values({
        submissionId,
        criterionId: c.id,
        status: result.status,
        confidence: result.confidence,
        reasoning: result.reasoning,
        evaluationData: result.data,
      })
      .returning();
    results.push(row);
  }

  let decision: "Eligible" | "Not Eligible" | "Needs Review";
  if (mandatoryFailed) decision = "Not Eligible";
  else if (needsReview || confidences.some((c) => c < 0.6)) decision = "Needs Review";
  else decision = "Eligible";

  const avgConfidence = confidences.length === 0 ? 0 : confidences.reduce((s, n) => s + n, 0) / confidences.length;
  // blend rule confidence with submission-level extraction/verification confidence
  const overall = clamp01(0.6 * avgConfidence + 0.4 * (submission.confidence ?? 0));

  await setSubmissionConfidence(submissionId, overall);
  await setSubmissionStatus(submissionId, "evaluated", actor, { decision, confidence: overall });

  await logAudit({
    submissionId,
    action: "evaluation",
    actor: "system",
    metadata: { decision, confidence: overall, criteriaCount: criteria.length },
  });

  return { submissionId, decision, confidence: overall, evaluations: results };
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

interface RuleResult {
  status: "pass" | "fail" | "review";
  confidence: number;
  reasoning: string;
  data: Record<string, unknown>;
}

/**
 * Apply a single criterion against the extracted fields from all processed documents.
 * The criterion's `criteriaData.field` (optional) names the JSON field path to look up,
 * otherwise the criterion's `condition` and `value` are evaluated against any matching field.
 */
function applyRule(criterion: CriterionRow, docs: DocumentRow[]): RuleResult {
  const fieldName = (criterion.criteriaData as { field?: string } | null)?.field;
  const extractedFields = collectExtractedFields(docs);
  const fieldValue = fieldName ? extractedFields[fieldName] : undefined;
  const minExtractionConf = minExtractionConfidence(docs);

  switch (criterion.type) {
    case "numeric": {
      const lhs = Number(fieldValue);
      const rhs = Number(criterion.value);
      if (Number.isNaN(lhs) || Number.isNaN(rhs)) {
        return {
          status: "review",
          confidence: 0.4,
          reasoning: `Could not parse numeric value for field "${fieldName ?? "(unset)"}"`,
          data: { lhs: fieldValue, rhs: criterion.value, condition: criterion.condition },
        };
      }
      const ok = numericCompare(lhs, criterion.condition, rhs);
      return {
        status: ok ? "pass" : "fail",
        confidence: minExtractionConf,
        reasoning: `Numeric ${lhs} ${criterion.condition} ${rhs} → ${ok}`,
        data: { lhs, rhs, condition: criterion.condition },
      };
    }
    case "boolean": {
      const expected = criterion.value === "true" || criterion.value === "1";
      let actual: boolean | undefined;
      if (criterion.condition === "exists") actual = fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
      else if (criterion.condition === "valid") actual = Boolean(fieldValue);
      else actual = Boolean(fieldValue) === expected;
      const ok = expected === actual;
      return {
        status: ok ? "pass" : "fail",
        confidence: minExtractionConf,
        reasoning: `Boolean ${criterion.condition}(${fieldName ?? "any"}) expected=${expected} actual=${actual}`,
        data: { expected, actual, condition: criterion.condition },
      };
    }
    case "string": {
      const lhs = String(fieldValue ?? "");
      const rhs = String(criterion.value);
      let ok = false;
      if (criterion.condition === "equals") ok = lhs === rhs;
      else if (criterion.condition === "contains") ok = lhs.toLowerCase().includes(rhs.toLowerCase());
      else
        return {
          status: "review",
          confidence: 0.5,
          reasoning: `Unsupported string condition: ${criterion.condition}`,
          data: { lhs, rhs, condition: criterion.condition },
        };
      return {
        status: ok ? "pass" : "fail",
        confidence: minExtractionConf,
        reasoning: `String "${lhs}" ${criterion.condition} "${rhs}" → ${ok}`,
        data: { lhs, rhs, condition: criterion.condition },
      };
    }
  }
}

function numericCompare(lhs: number, op: string, rhs: number): boolean {
  switch (op) {
    case ">":
      return lhs > rhs;
    case ">=":
      return lhs >= rhs;
    case "<":
      return lhs < rhs;
    case "<=":
      return lhs <= rhs;
    case "==":
    case "=":
      return lhs === rhs;
    case "!=":
      return lhs !== rhs;
    default:
      return false;
  }
}

function collectExtractedFields(docs: DocumentRow[]): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  for (const d of docs) {
    const meta = d.metadata as { extraction?: Record<string, unknown> } | null;
    if (meta?.extraction) Object.assign(merged, meta.extraction);
  }
  return merged;
}

function minExtractionConfidence(docs: DocumentRow[]): number {
  let min = 1;
  for (const d of docs) {
    const meta = d.metadata as { extractionConfidence?: number } | null;
    const c = meta?.extractionConfidence;
    if (typeof c === "number" && c < min) min = c;
  }
  if (docs.length === 0) min = 0.5;
  return min;
}
