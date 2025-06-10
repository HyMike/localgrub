import express, { Request, Response } from "express";
import cors from 'cors';
import sendOrder from "./services/order-queue-producer";
import admin from 'firebase-admin';
import dotenv from "dotenv";
import { db } from "./utils/firebaseAdmin";
import { getNameEmailItemQuantity } from "./services/user-service";
import { orderReady } from "./services/order-ready-producer";



dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

type userInfo = {
    name: string;
    email: string;
    itemName: string;
    quantity: number;
} | null


app.post("/success", async (req: Request, res: Response): Promise<any> => {
    const authHeader = req.headers.authorization;
    const { id: itemId, name: itemName, quantity, price, creditCardInfo } = req.body;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized');
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        //get and verify user.
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User data not found' });
        }
        //create an order collection. 
        const ordersRef =  db.collection('users').doc(uid).collection('orders');
        
        const userOrder = {
            itemId, 
            itemName,
            quantity, 
            price,
            creditCardInfo,
            createdAt: new Date().toISOString(),
        }
        
        const orderRef = await ordersRef.add({
            ...userOrder,
            status: "pending",
        });

        //get user data from firestore
        const email = decodedToken.email || '';
        const userData = userDoc.data();
        const firstName = userData?.firstName || '';
        const lastName = userData?.lastName || '';


        const order = {
            uid,
            firstName,
            lastName,
            email,
            ...userOrder,
        };
        console.log("Received Order:", order);

        await sendOrder(order);



    } catch (error) {
        console.error("Order service is not processing!", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

//order page to update the status to ready
app.post("/order-ready", async (req: Request, res: Response): Promise<any> => {
  const { orderId, userId } = req.body;

  try {

    const orderRef = db.doc(`users/${userId}/orders/${orderId}`);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.status(404).json({ message: "Order not found" });
    }

    await orderRef.update({ status: "Ready" });

    //call producer to emit to notification to let customer know order is ready for pickup. 
    const userInfo = await getNameEmailItemQuantity(userId, orderId);
    orderReady(userInfo!);

    res.status(200).json({ message: "Order status updated to Ready" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});


const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Order service is running on port ${PORT}`);
});
