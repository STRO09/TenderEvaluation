import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { criteriaTable, tendersTable } from "../schema";
import { NotFound } from "../utils/errors";

export async function addCriterion(
  tenderId: string,
  input: {
    type: "numeric" | "boolean" | "string";
    condition: string;
    value: string;
    mandatory?: boolean;
    criteriaData?: Record<string, unknown>;
  },
) {
  const [tender] = await db.select().from(tendersTable).where(eq(tendersTable.id, tenderId)).limit(1);
  if (!tender) throw NotFound("Tender not found");

  const [row] = await db
    .insert(criteriaTable)
    .values({
      tenderId,
      type: input.type,
      condition: input.condition,
      value: input.value,
      mandatory: input.mandatory ?? true,
      criteriaData: input.criteriaData ?? {},
    })
    .returning();
  return row;
}

export async function updateCriterion(
  id: string,
  input: Partial<{
    type: "numeric" | "boolean" | "string";
    condition: string;
    value: string;
    mandatory: boolean;
    criteriaData: Record<string, unknown>;
  }>,
) {
  const [row] = await db
    .update(criteriaTable)
    .set(input)
    .where(eq(criteriaTable.id, id))
    .returning();
  if (!row) throw NotFound("Criterion not found");
  return row;
}

export async function deleteCriterion(id: string): Promise<void> {
  const result = await db.delete(criteriaTable).where(eq(criteriaTable.id, id)).returning();
  if (result.length === 0) throw NotFound("Criterion not found");
}
