import { eq, desc } from "drizzle-orm";
import { db } from "../config/db";
import { auditLogsTable } from "../schema";

export async function logAudit(input: {
  submissionId?: string;
  action: string;
  actor: string; // "system" or user id
  metadata?: Record<string, unknown>;
}) {
  const [row] = await db
    .insert(auditLogsTable)
    .values({
      submissionId: input.submissionId,
      action: input.action,
      actor: input.actor,
      metadata: input.metadata ?? {},
    })
    .returning();
  return row;
}

export async function listAuditForSubmission(submissionId: string) {
  return db
    .select()
    .from(auditLogsTable)
    .where(eq(auditLogsTable.submissionId, submissionId))
    .orderBy(desc(auditLogsTable.createdAt));
}
