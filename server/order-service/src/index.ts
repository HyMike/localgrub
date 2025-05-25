import express, { Request, Response } from "express";
import cors from 'cors';
import sendOrder from "./services/order-queue-producer";
import admin from 'firebase-admin';
import dotenv from "dotenv";
import { ServiceAccount } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { send } from "process";


dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

type Order = {
    id: number;
    name: string;
    img: string;
};


admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
    } as ServiceAccount),
});
const db = getFirestore();


app.post("/success", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const { id: itemId, name: itemName } = req.body;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized');
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);


        const uid = decodedToken.uid;

        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User data not found' });
        }
        const email = decodedToken.email || '';
        const userData = userDoc.data();
        const firstName = userData?.firstName || '';
        const lastName = userData?.lastName || '';

        const order = {
            uid,
            firstName,
            lastName,
            email,
            itemId,
            itemName,
            createdAt: new Date().toISOString(),
        };
        console.log("Received Order:", order);

        await sendOrder(order);



    } catch (error) {
        console.error("Order service is not processing!", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});


app.get("/users", (req, res) => {
    res.json([{ id: 1, name: "alice" }]);
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Order service is running on port ${PORT}`);
});
