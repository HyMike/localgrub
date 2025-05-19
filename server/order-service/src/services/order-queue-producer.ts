import express from 'express';
import admin from 'firebase-admin';
import amqp from 'amqplib';
import dotenv from "dotenv";
import { ServiceAccount } from 'firebase-admin';


dotenv.config();


const app = express();
app.use(express.json());

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

export default sendOrder; 