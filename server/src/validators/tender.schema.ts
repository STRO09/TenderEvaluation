import { z } from "zod";

export const tenderStatusSchema = z.enum(["draft", "published", "closed", "archived"]);

export const createTenderSchema = z.object({
  title: z.string().min(1).max(255),
  department: z.string().min(1).max(255),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "deadline must be YYYY-MM-DD")
    .optional(),
  status: tenderStatusSchema.optional(),
  tenderData: z.record(z.string(), z.unknown()).optional(),
});

export const listTendersQuerySchema = z.object({
  q: z.string().optional(),
  department: z.string().optional(),
  status: tenderStatusSchema.optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export const criterionTypeSchema = z.enum(["numeric", "boolean", "string"]);

export const createCriterionSchema = z.object({
  type: criterionTypeSchema,
  condition: z.string().min(1),
  value: z.string(),
  mandatory: z.boolean().optional(),
  criteriaData: z.record(z.string(), z.unknown()).optional(),
});

export const updateCriterionSchema = createCriterionSchema.partial();
