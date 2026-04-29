import { eq } from "drizzle-orm";
import { db, documentsTable, submissionsTable } from "@workspace/db";
import { Forbidden, NotFound } from "../utils/errors";
import { logAudit } from "./audit.service";

export interface UploadInput {
  submissionId: string;
  type: string;
  fileUrl: string;
  metadata?: Record<string, unknown>;
  actor: string;
  restrictCompanyId?: string;
}

export async function uploadDocument(input: UploadInput) {
  const [submission] = await db
    .select()
    .from(submissionsTable)
    .where(eq(submissionsTable.id, input.submissionId))
    .limit(1);
  if (!submission) throw NotFound("Submission not found");
  if (input.restrictCompanyId && submission.companyId !== input.restrictCompanyId) {
    throw Forbidden("You don't own this submission");
  }

  const [row] = await db
    .insert(documentsTable)
    .values({
      submissionId: input.submissionId,
      type: input.type,
      fileUrl: input.fileUrl,
      status: "uploaded",
      version: 1,
      metadata: input.metadata ?? {},
    })
    .returning();

  await logAudit({
    submissionId: input.submissionId,
    action: "document.uploaded",
    actor: input.actor,
    metadata: { documentId: row.id, type: input.type },
  });

  return row;
}

export async function reuploadDocument(input: {
  documentId: string;
  fileUrl: string;
  metadata?: Record<string, unknown>;
  actor: string;
  restrictCompanyId?: string;
}) {
  const [existing] = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.id, input.documentId))
    .limit(1);
  if (!existing) throw NotFound("Document not found");

  const [submission] = await db
    .select()
    .from(submissionsTable)
    .where(eq(submissionsTable.id, existing.submissionId))
    .limit(1);
  if (input.restrictCompanyId && submission && submission.companyId !== input.restrictCompanyId) {
    throw Forbidden("You don't own this document");
  }

  const [row] = await db
    .update(documentsTable)
    .set({
      fileUrl: input.fileUrl,
      version: existing.version + 1,
      status: "uploaded",
      metadata: input.metadata ?? existing.metadata,
    })
    .where(eq(documentsTable.id, input.documentId))
    .returning();

  await logAudit({
    submissionId: existing.submissionId,
    action: "document.reuploaded",
    actor: input.actor,
    metadata: { documentId: input.documentId, version: row.version },
  });

  return row;
}
