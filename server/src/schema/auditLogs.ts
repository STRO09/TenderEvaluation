import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { submissionsTable } from "./submissions";

export const auditLogsTable = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").references(() => submissionsTable.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // e.g. "extraction", "verification", "evaluation", "override", "status_change"
  actor: text("actor").notNull(), // e.g. "system" or user UUID
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type AuditLog = typeof auditLogsTable.$inferSelect;
export type InsertAuditLog = typeof auditLogsTable.$inferInsert;
