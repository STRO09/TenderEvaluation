import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { documentsTable, submissionsTable  } from "../schema";
import { NotFound } from "../utils/errors";
import { logAudit } from "./audit.service";
import { setSubmissionStatus, setSubmissionConfidence } from "./submission.service";

/**
 * Simulate AI extraction + cross-verification for all documents on a submission.
 * Stores mock JSON data on each document and on the submission.
 */
export async function processSubmission(submissionId: string, actor: string) {
  const [submission] = await db
    .select()
    .from(submissionsTable)
    .where(eq(submissionsTable.id, submissionId))
    .limit(1);
  if (!submission) throw NotFound("Submission not found");

  await setSubmissionStatus(submissionId, "processing", actor, { stage: "ai_extraction" });

  const docs = await db.select().from(documentsTable).where(eq(documentsTable.submissionId, submissionId));

  const extractionResults: Array<{ documentId: string; confidence: number; fields: Record<string, unknown> }> = [];

  for (const doc of docs) {
    const mockExtraction = mockExtractFor(doc.type);
    await db
      .update(documentsTable)
      .set({
        status: "processed",
        metadata: {
          ...(doc.metadata ?? {}),
          extraction: mockExtraction.fields,
          extractionConfidence: mockExtraction.confidence,
        },
      })
      .where(eq(documentsTable.id, doc.id));

    await logAudit({
      submissionId,
      action: "extraction",
      actor: "system",
      metadata: { documentId: doc.id, confidence: mockExtraction.confidence },
    });

    extractionResults.push({ documentId: doc.id, ...mockExtraction });
  }

  // Mock cross-verification (e.g. GST/MCA) — average extraction confidence with a small noise factor
  const verification = mockCrossVerify(extractionResults);
  await logAudit({
    submissionId,
    action: "verification",
    actor: "system",
    metadata: verification,
  });

  // Compute submission-level confidence from extraction + verification
  const extractionAvg =
    extractionResults.length === 0
      ? 0
      : extractionResults.reduce((s, r) => s + r.confidence, 0) / extractionResults.length;
  const overallConfidence = clamp01(extractionAvg * 0.7 + verification.score * 0.3);

  await db
    .update(submissionsTable)
    .set({
      submissionData: {
        ...(submission.submissionData ?? {}),
        extraction: extractionResults,
        verification,
      },
    })
    .where(eq(submissionsTable.id, submissionId));

  await setSubmissionConfidence(submissionId, overallConfidence);

  return { submissionId, confidence: overallConfidence, documents: extractionResults, verification };
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function mockExtractFor(type: string): { confidence: number; fields: Record<string, unknown> } {
  const baseConfidence = 0.78 + Math.random() * 0.2;
  const confidence = Number(baseConfidence.toFixed(3));
  switch (type.toLowerCase()) {
    case "gst":
      return { confidence, fields: { gstNumber: "27AAAAA0000A1Z5", validUntil: "2026-12-31" } };
    case "pan":
      return { confidence, fields: { panNumber: "AAAPL1234C", entityName: "Acme Pvt Ltd" } };
    case "balancesheet":
    case "balance_sheet":
      return { confidence, fields: { annualTurnover: 12500000, currency: "INR", fy: "2023-24" } };
    default:
      return { confidence, fields: { ocrText: `Mock extracted text for ${type}` } };
  }
}

function mockCrossVerify(extractions: Array<{ confidence: number }>): { score: number; checks: Record<string, boolean> } {
  const baseScore = extractions.length === 0 ? 0 : 0.85 + Math.random() * 0.1;
  return {
    score: Number(baseScore.toFixed(3)),
    checks: {
      gstActive: true,
      mcaRegistered: true,
      panMatches: true,
    },
  };
}
