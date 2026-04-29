import { and, desc, eq, sql, type SQL } from "drizzle-orm";
import { db } from "../config/db";
import { submissionsTable, documentsTable, evaluationsTable, tendersTable } from "../schema";
import { Forbidden, NotFound } from "../utils/errors";
import { logAudit } from "./audit.service";

export async function createSubmission(input: {
  tenderId: string;
  companyId: string;
  submissionData?: Record<string, unknown>;
}) {
  const [tender] = await db.select().from(tendersTable).where(eq(tendersTable.id, input.tenderId)).limit(1);
  if (!tender) throw NotFound("Tender not found");

  const [row] = await db
    .insert(submissionsTable)
    .values({
      tenderId: input.tenderId,
      companyId: input.companyId,
      submissionData: input.submissionData ?? {},
      status: "uploaded",
    })
    .returning();

  await logAudit({
    submissionId: row.id,
    action: "submission.created",
    actor: input.companyId,
    metadata: { tenderId: input.tenderId },
  });

  return row;
}

export interface ListSubmissionsOptions {
  tenderId?: string;
  status?: "uploaded" | "processing" | "evaluated" | "reviewed";
  companyId?: string; // when set (e.g. by company role), restrict to this company
  page?: number;
  pageSize?: number;
}

export async function listSubmissions(opts: ListSubmissionsOptions) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20));
  const offset = (page - 1) * pageSize;

  const conds: SQL[] = [];
  if (opts.tenderId) conds.push(eq(submissionsTable.tenderId, opts.tenderId));
  if (opts.status) conds.push(eq(submissionsTable.status, opts.status));
  if (opts.companyId) conds.push(eq(submissionsTable.companyId, opts.companyId));

  const where = conds.length ? and(...conds) : undefined;

  const rows = await db
    .select()
    .from(submissionsTable)
    .where(where)
    .orderBy(desc(submissionsTable.createdAt))
    .limit(pageSize)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(submissionsTable)
    .where(where);

  return { rows, page, pageSize, total: Number(count ?? 0) };
}

export async function getSubmissionById(id: string, opts: { restrictCompanyId?: string } = {}) {
  const [row] = await db.select().from(submissionsTable).where(eq(submissionsTable.id, id)).limit(1);
  if (!row) throw NotFound("Submission not found");
  if (opts.restrictCompanyId && row.companyId !== opts.restrictCompanyId) {
    throw Forbidden("You don't have access to this submission");
  }
  const documents = await db.select().from(documentsTable).where(eq(documentsTable.submissionId, id));
  const evaluations = await db.select().from(evaluationsTable).where(eq(evaluationsTable.submissionId, id));
  return { ...row, documents, evaluations };
}

export async function setSubmissionStatus(
  id: string,
  status: "uploaded" | "processing" | "evaluated" | "reviewed",
  actor: string,
  extra?: Record<string, unknown>,
) {
  const [row] = await db
    .update(submissionsTable)
    .set({ status, updatedAt: new Date() })
    .where(eq(submissionsTable.id, id))
    .returning();
  if (!row) throw NotFound("Submission not found");
  await logAudit({
    submissionId: id,
    action: "submission.status_changed",
    actor,
    metadata: { status, ...(extra ?? {}) },
  });
  return row;
}

export async function setSubmissionConfidence(id: string, confidence: number) {
  await db
    .update(submissionsTable)
    .set({ confidence, updatedAt: new Date() })
    .where(eq(submissionsTable.id, id));
}

export async function overrideSubmission(input: {
  submissionId: string;
  status: "uploaded" | "processing" | "evaluated" | "reviewed";
  reason: string;
  actor: string;
}) {
  const updated = await setSubmissionStatus(input.submissionId, input.status, input.actor, {
    override: true,
    reason: input.reason,
  });
  return updated;
}
