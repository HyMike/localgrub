import express from "express";
import dotenv from "dotenv";
import RabbitMQConnection from "./rabbitmq-connection";

dotenv.config();

const app = express();
app.use(express.json());

const sendOrder = async (order: object): Promise<void> => {
  try {
    const rabbitmq = RabbitMQConnection.getInstance();
    const channel = await rabbitmq.getChannel();

    const msg = JSON.stringify(order);

    await channel.assertExchange("topic_exc", "topic", { durable: true });

    channel.publish("topic_exc", "order.placed", Buffer.from(msg), {
      persistent: true,
    });

    console.log("Message is sent to from Order Service to queue:");
  } catch (error) {
    console.error("Failed to send order to queue:", error);
    throw new Error(`Failed to send order to queue: ${error}`);
  }
};

export default sendOrder;
