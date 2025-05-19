import express from 'express';
import admin from 'firebase-admin';
import amqp from 'amqplib';
import dotenv from "dotenv";
import { ServiceAccount } from 'firebase-admin';


dotenv.config();


const app = express();
app.use(express.json());


admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
    } as ServiceAccount),
});


const sendOrder = async (order: object): Promise<void> => {
    const conn = await amqp.connect('amqp://localhost:5672');
    const channel = await conn.createChannel();

    const queue = 'order';
    const msg = JSON.stringify(order);

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg));

    console.log("Message is sent to queue:", msg);

    await channel.close();
    await conn.close();
};


const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default sendOrder; 