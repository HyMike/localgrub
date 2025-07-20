import { Router } from "express";
import preparedOrder from "../controllers/orderPrepareController";

const router = Router();

router.post("/incredients-found", preparedOrder);

export default router;
