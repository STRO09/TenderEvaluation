import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { param } from "../utils/params";
import {
  createTender,
  getTenderById,
  listTenders,
  type ListTendersOptions,
} from "../services/tender.service";
import {
  addCriterion,
  updateCriterion,
  deleteCriterion,
} from "../services/criterion.service";
import { Unauthorized } from "../utils/errors";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const q = (req as unknown as { validatedQuery: ListTendersOptions }).validatedQuery ?? {};
  const result = await listTenders(q);
  res.json(result);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const tender = await getTenderById(param(req, "id"));
  res.json(tender);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  // if (!req.user) throw Unauthorized();
  const tender = await createTender({ ...req.body, createdBy: "govt" });
  res.status(201).json(tender);
});

export const addCriterionCtrl = asyncHandler(async (req: Request, res: Response) => {
  const c = await addCriterion(param(req, "tenderId"), req.body);
  res.status(201).json(c);
});

export const updateCriterionCtrl = asyncHandler(async (req: Request, res: Response) => {
  const c = await updateCriterion(param(req, "criterionId"), req.body);
  res.json(c);
});

export const deleteCriterionCtrl = asyncHandler(async (req: Request, res: Response) => {
  await deleteCriterion(param(req, "criterionId"));
  res.status(204).end();
});
