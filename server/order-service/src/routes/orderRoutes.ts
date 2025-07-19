import { Router } from "express";
import { createOrder } from "../controllers/orderController";

const router = Router(); 

router.post("/success", createOrder);

export default router;