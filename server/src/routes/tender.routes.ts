import { Router } from "express";
import { validateBody, validateQuery } from "../middlewares/validate";
import { verifyJWT, requireRole } from "../middlewares/auth";
import {
  createTenderSchema,
  listTendersQuerySchema,
  createCriterionSchema,
  updateCriterionSchema,
} from "../validators/tender.schema";
import * as ctrl from "../controllers/tender.controller";

const router: Router = Router();

router.get("/", verifyJWT, validateQuery(listTendersQuerySchema), ctrl.list);
router.get("/:id", verifyJWT, ctrl.getOne);
router.post(
  "/",
  verifyJWT,
  requireRole("government"),
  validateBody(createTenderSchema),
  ctrl.create,
);

// criteria nested under a tender
router.post(
  "/:tenderId/criteria",
  verifyJWT,
  requireRole("government"),
  validateBody(createCriterionSchema),
  ctrl.addCriterionCtrl,
);
router.patch(
  "/criteria/:criterionId",
  verifyJWT,
  requireRole("government"),
  validateBody(updateCriterionSchema),
  ctrl.updateCriterionCtrl,
);
router.delete(
  "/criteria/:criterionId",
  verifyJWT,
  requireRole("government"),
  ctrl.deleteCriterionCtrl,
);

export default router;
