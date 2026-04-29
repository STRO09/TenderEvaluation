import { pgTable, uuid, text, jsonb, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { submissionsTable } from "./submissions";

export const documentStatusEnum = pgEnum("document_status", [
  "uploaded",
  "processing",
  "processed",
  "failed",
]);

export const documentsTable = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").notNull().references(() => submissionsTable.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(), // local path or remote URL
  type: text("type").notNull(), // e.g. "GST", "PAN", "BalanceSheet"
  status: documentStatusEnum("status").default("uploaded").notNull(),
  version: integer("version").default(1).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Document = typeof documentsTable.$inferSelect;
export type InsertDocument = typeof documentsTable.$inferInsert;
