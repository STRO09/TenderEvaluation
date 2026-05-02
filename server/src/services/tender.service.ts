import { and, desc, eq, ilike, sql, type SQL } from "drizzle-orm";
import { db } from "../config/db";
import { tendersTable, criteriaTable } from "../schema";
import { NotFound } from "../utils/errors";

export interface ListTendersOptions {
  q?: string;
  department?: string;
  status?: "draft" | "published" | "closed" | "archived";
  page?: number;
  pageSize?: number;
}

export async function listTenders(opts: ListTendersOptions) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20));
  const offset = (page - 1) * pageSize;

  const conds: SQL[] = [];
  if (opts.q) conds.push(ilike(tendersTable.title, `%${opts.q}%`));
  if (opts.department) conds.push(eq(tendersTable.department, opts.department));
  if (opts.status) conds.push(eq(tendersTable.status, opts.status));

  const where = conds.length ? and(...conds) : undefined;

  const rows = await db
    .select()
    .from(tendersTable)
    .where(where)
    .orderBy(desc(tendersTable.createdAt))
    .limit(pageSize)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(tendersTable)
    .where(where);

  return { rows, page, pageSize, total: Number(count ?? 0) };
}

export async function getTenderById(id: string) {
  const [tender] = await db.select().from(tendersTable).where(eq(tendersTable.id, id)).limit(1);
  if (!tender) throw NotFound("Tender not found");
  const criteria = await db.select().from(criteriaTable).where(eq(criteriaTable.tenderId, id));
  return { ...tender, criteria };
}

export async function createTender(input: {
  title: string;
  department: string;
  category?: string;
  description?: string;
  submissionStartDate?: string;
  submissionDeadline?: string;
  budgetMin?: number;
  budgetMax?: number;
  eligibilityCriteria?: unknown[];
  requiredDocuments?: unknown[];
  evaluationRules?: Record<string, unknown>;
  confidenceThresholds?: Record<string, unknown>;
  deadline?: string;
  status?: "draft" | "published" | "closed" | "archived";
  tenderData?: Record<string, unknown>;
  createdBy: string;
}) {
  const [row] = await db
    .insert(tendersTable)
    .values({
      title:               input.title,
      department:          input.department,
      category:            input.category ?? '',
      description:         input.description ?? '',
      submissionStartDate: input.submissionStartDate?.split('T')[0] ?? input.deadline,
      submissionDeadline:  input.submissionDeadline?.split('T')[0],
      budgetMin:           String(input.budgetMin ?? 0),
      budgetMax:           String(input.budgetMax ?? 0),
      status:              input.status ?? "draft",
      createdBy:           input.createdBy,
      // pack the rich fields into tenderData so nothing is lost
      tenderData: {
        ...(input.tenderData ?? {}),
        eligibilityCriteria:  input.eligibilityCriteria  ?? [],
        requiredDocuments:    input.requiredDocuments    ?? [],
        evaluationRules:      input.evaluationRules      ?? {},
        confidenceThresholds: input.confidenceThresholds ?? {},
      },
    })
    .returning();
  return row;
}