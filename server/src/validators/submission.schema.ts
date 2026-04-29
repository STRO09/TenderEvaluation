import { z } from "zod";

export const submissionStatusSchema = z.enum(["uploaded", "processing", "evaluated", "reviewed"]);

export const createSubmissionSchema = z.object({
  tenderId: z.string().uuid(),
  submissionData: z.record(z.string(), z.unknown()).optional(),
});

export const listSubmissionsQuerySchema = z.object({
  tenderId: z.string().uuid().optional(),
  status: submissionStatusSchema.optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export const overrideSubmissionSchema = z.object({
  status: submissionStatusSchema,
  reason: z.string().min(3).max(500),
});

export const documentTypeSchema = z.string().min(1).max(64);
