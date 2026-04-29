import { pgTable, uuid, jsonb, timestamp, real, pgEnum } from "drizzle-orm/pg-core";
import { tendersTable } from "./tenders";
import { usersTable } from "./users";

export const submissionStatusEnum = pgEnum("submission_status", [
  "uploaded",
  "processing",
  "evaluated",
  "reviewed",
]);

export const submissionsTable = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenderId: uuid("tender_id").notNull().references(() => tendersTable.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  status: submissionStatusEnum("status").default("uploaded").notNull(),
  confidence: real("confidence").default(0).notNull(),
  submissionData: jsonb("submission_data").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Submission = typeof submissionsTable.$inferSelect;
export type InsertSubmission = typeof submissionsTable.$inferInsert;
