import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { param } from "../utils/params";
import {
  createSubmission,
  getSubmissionById,
  listSubmissions,
  overrideSubmission,
  type ListSubmissionsOptions,
} from "../services/submission.service";
import { uploadDocument, reuploadDocument } from "../services/document.service";
import { processSubmission } from "../services/processing.service";
import { evaluateSubmission } from "../services/evaluation.service";
import { listAuditForSubmission } from "../services/audit.service";
import { BadRequest, Unauthorized } from "../utils/errors";

export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw Unauthorized();
  const sub = await createSubmission({ ...req.body, companyId: req.user.sub });
  res.status(201).json(sub);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw Unauthorized();
  const q = (req as unknown as { validatedQuery: ListSubmissionsOptions }).validatedQuery ?? {};
  const opts: ListSubmissionsOptions = { ...q };
  if (req.user.role === "company") opts.companyId = req.user.sub;
  const result = await listSubmissions(opts);
  res.json(result);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw Unauthorized();
  const restrict = req.user.role === "company" ? req.user.sub : undefined;
  const sub = await getSubmissionById(param(req, "id"), { restrictCompanyId: restrict });
  res.json(sub);
});

export const uploadDoc = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw Unauthorized();
  const file = req.file;
  if (!file) throw BadRequest("Missing file (field name: 'file')");
  const type = (req.body?.type as string | undefined)?.trim();
  if (!type) throw BadRequest("Missing document type (form field: 'type')");

  const restrict = req.user.role === "company" ? req.user.sub : undefined;
  const doc = await uploadDocument({
    submissionId: param(req, "id"),
    type,
    fileUrl: `/${file.path.split("/").slice(-2).join("/")}`,
    metadata: { originalName: file.originalname, mimetype: file.mimetype, size: file.size },
    actor: req.user.sub,
    restrictCompanyId: restrict,
  });
  res.status(201).json(doc);
});

export const reuploadDoc = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw Unauthorized();
  const file = req.file;
  if (!file) throw BadRequest("Missing file (field name: 'file')");
  const restrict = req.user.role === "company" ? req.user.sub : undefined;
  const doc = await reuploadDocument({
    documentId: param(req, "documentId"),
    fileUrl: `/${file.path.split("/").slice(-2).join("/")}`,
    metadata: { originalName: file.originalname, mimetype: file.mimetype, size: file.size },
    actor: req.user.sub,
    restrictCompanyId: restrict,
  });
  res.json(doc);
});

export const process = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw Unauthorized();
  const result = await processSubmission(param(req, "id"), req.user.sub);
  res.json(result);
});

export const evaluate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw Unauthorized();
  const result = await evaluateSubmission(param(req, "id"), req.user.sub);
  res.json(result);
});

export const override = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw Unauthorized();
  const updated = await overrideSubmission({
    submissionId: param(req, "id"),
    status: req.body.status,
    reason: req.body.reason,
    actor: req.user.sub,
  });
  res.json(updated);
});

export const audit = asyncHandler(async (req: Request, res: Response) => {
  const rows = await listAuditForSubmission(param(req, "id"));
  res.json({ rows });
});
