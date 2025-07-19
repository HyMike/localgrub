import express, { Request, Response } from "express";
import cors from "cors";
import sendOrder from "./services/order-queue-producer";
import admin from "firebase-admin";
import dotenv from "dotenv";
import { db } from "./utils/firebaseAdmin";
import { getNameEmailItemQuantity } from "./services/user-service";
import { orderReady } from "./services/order-ready-producer";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:4173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/", orderRoutes);

//order page to update the status to ready
// app.post("/order-ready", async (req: Request, res: Response): Promise<any> => {
  // const { orderId, userId } = req.body;

//   try {
//     const orderRef = db.doc(`users/${userId}/orders/${orderId}`);
//     const orderSnap = await orderRef.get();

//     if (!orderSnap.exists) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     await orderRef.update({ status: "Ready" });

//     //call producer to emit to notification to let customer know order is ready for pickup.
//     const userInfo = await getNameEmailItemQuantity(userId, orderId);
//     orderReady(userInfo!);

//     res.status(200).json({ message: "Order status updated to Ready" });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ error: "Failed to update order status" });
//   }
// });

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
