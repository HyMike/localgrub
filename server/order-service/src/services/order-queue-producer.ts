import express from 'express';
import admin from 'firebase-admin';
import amqp from 'amqplib';
import dotenv from "dotenv";
import { ServiceAccount } from 'firebase-admin';


dotenv.config();


const app = express();
app.use(express.json());

const sendOrder = async (order: object): Promise<void> => {
    const conn = await amqp.connect('amqp://rabbitmq:5672');
    const channel = await conn.createChannel();

    const msg = JSON.stringify(order);

    await channel.assertExchange("topic_exc", "topic", { durable: true });

    channel.publish(
        "topic_exc",
        "order.placed",
        Buffer.from(msg), { persistent: true });

    console.log("Message is sent to from Order Service to queue:");

    await channel.close();
    await conn.close();
};

export default sendOrder; 