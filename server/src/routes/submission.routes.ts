import { Router } from "express";
import { validateBody, validateQuery } from "../middlewares/validate";
import { verifyJWT, requireRole } from "../middlewares/auth";
import { upload } from "../middlewares/upload";
import {
  createSubmissionSchema,
  listSubmissionsQuerySchema,
  overrideSubmissionSchema,
} from "../validators/submission.schema";
import * as ctrl from "../controllers/submission.controller";

const router: Router = Router();

router.post(
  "/",
  verifyJWT,
  requireRole("company"),
  validateBody(createSubmissionSchema),
  ctrl.create,
);

router.get("/", verifyJWT, validateQuery(listSubmissionsQuerySchema), ctrl.list);

router.get("/:id", verifyJWT, ctrl.getOne);
router.get("/:id/audit", verifyJWT, ctrl.audit);

router.post(
  "/:id/documents",
  verifyJWT,
  requireRole("company"),
  upload.single("file"),
  ctrl.uploadDoc,
);
router.put(
  "/:id/documents/:documentId",
  verifyJWT,
  requireRole("company"),
  upload.single("file"),
  ctrl.reuploadDoc,
);

router.post(
  "/:id/process",
  verifyJWT,
  requireRole("government", "company"),
  ctrl.process,
);
router.post(
  "/:id/evaluate",
  verifyJWT,
  requireRole("government"),
  ctrl.evaluate,
);
router.post(
  "/:id/override",
  verifyJWT,
  requireRole("government"),
  validateBody(overrideSubmissionSchema),
  ctrl.override,
);

export default router;
