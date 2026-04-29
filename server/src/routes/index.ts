import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth.routes";
import tenderRouter from "./tender.routes";
import submissionRouter from "./submission.routes";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/tenders", tenderRouter);
router.use("/submissions", submissionRouter);

export default router;
