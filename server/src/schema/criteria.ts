import { pgTable, uuid, text, jsonb, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { tendersTable } from "./tenders";

export const criterionTypeEnum = pgEnum("criterion_type", ["numeric", "boolean", "string"]);

export const criteriaTable = pgTable("criteria", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenderId: uuid("tender_id").notNull().references(() => tendersTable.id, { onDelete: "cascade" }),
  type: criterionTypeEnum("type").notNull(),
  condition: text("condition").notNull(), // e.g. ">=", "<=", "==", "exists", "contains"
  value: text("value").notNull(), // serialized value (stringified)
  mandatory: boolean("mandatory").default(true).notNull(),
  criteriaData: jsonb("criteria_data").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Criterion = typeof criteriaTable.$inferSelect;
export type InsertCriterion = typeof criteriaTable.$inferInsert;
