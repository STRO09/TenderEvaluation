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
  deadline?: string;
  status?: "draft" | "published" | "closed" | "archived";
  tenderData?: Record<string, unknown>;
  createdBy: string;
}) {
  const [row] = await db
    .insert(tendersTable)
    .values({
      title: input.title,
      department: input.department,
      deadline: input.deadline,
      status: input.status ?? "draft",
      tenderData: input.tenderData ?? {},
      createdBy: input.createdBy,
    })
    .returning();
  return row;
}
