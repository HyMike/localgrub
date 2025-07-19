import { Router } from "express";
import { createOrder } from "../controllers/orderController";
import { orderCompleted } from "../controllers/orderReadyController";

const router = Router(); 

router.post("/success", createOrder);
router.post("/order-ready", orderCompleted as any);

export default router;