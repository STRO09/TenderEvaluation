import { pgTable, uuid, text, jsonb, timestamp, real, pgEnum } from "drizzle-orm/pg-core";
import { submissionsTable } from "./submissions";
import { criteriaTable } from "./criteria";

export const evaluationStatusEnum = pgEnum("evaluation_status", ["pass", "fail", "review"]);

export const evaluationsTable = pgTable("evaluations", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").notNull().references(() => submissionsTable.id, { onDelete: "cascade" }),
  criterionId: uuid("criterion_id").notNull().references(() => criteriaTable.id, { onDelete: "cascade" }),
  status: evaluationStatusEnum("status").notNull(),
  confidence: real("confidence").default(0).notNull(),
  reasoning: text("reasoning"),
  evaluationData: jsonb("evaluation_data").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Evaluation = typeof evaluationsTable.$inferSelect;
export type InsertEvaluation = typeof evaluationsTable.$inferInsert;
