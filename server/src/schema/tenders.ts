import { pgTable, uuid, text, jsonb, timestamp, pgEnum, date, numeric } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const tenderStatusEnum = pgEnum("tender_status", ["draft", "published", "closed", "archived"]);

export const tendersTable = pgTable("tenders", {
  id:                  uuid("id").primaryKey().defaultRandom(),
  title:               text("title").notNull(),
  department:          text("department").notNull(),
  category:            text("category").notNull().default(''),
  description:         text("description").notNull().default(''),
  submissionStartDate: date("submission_start_date"),
  submissionDeadline:  date("submission_deadline"),
  budgetMin:           numeric("budget_min", { precision: 15, scale: 2 }).default('0').notNull(),
  budgetMax:           numeric("budget_max", { precision: 15, scale: 2 }).default('0').notNull(),
  status:              tenderStatusEnum("status").default("draft").notNull(),
  createdBy:           uuid("created_by").references(() => usersTable.id, { onDelete: "set null" }),
  tenderData:          jsonb("tender_data").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt:           timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:           timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Tender       = typeof tendersTable.$inferSelect;
export type InsertTender = typeof tendersTable.$inferInsert;