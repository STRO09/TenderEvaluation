import { Router } from "express";
import { validateBody } from "../middlewares/validate";
import { verifyJWT } from "../middlewares/auth";
import { registerSchema, loginSchema } from "../validators/auth.schema";
import * as ctrl from "../controllers/auth.controller";

const router: Router = Router();

router.post("/register", validateBody(registerSchema), ctrl.register);
router.post("/login", validateBody(loginSchema), ctrl.login);
router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);
router.get("/me", verifyJWT, ctrl.me);

export default router;
