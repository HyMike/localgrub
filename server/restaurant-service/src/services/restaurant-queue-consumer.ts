import amqp, { ConsumeMessage } from "amqplib";
import checkInventory from "../repositories/orderRepository";
import axios from "axios";
import RabbitMQConnection from "./rabbitmq-connection";

const consumeOrder = async (): Promise<void> => {
  try {
    const rabbitmq = await RabbitMQConnection.getInstance();
    const channel = await rabbitmq.getChannel();

    await channel.assertExchange("topic_exc", "topic", { durable: true });
    const queueName = "orderCheck";

    const queueRes = await channel.assertQueue(queueName, { durable: true });

    await channel.bindQueue(queueName, "topic_exc", "order.placed");

    channel.consume(
      queueRes.queue,
      (msg: ConsumeMessage | null) => {
        if (msg) {
          (async () => {
            try {
              const order = JSON.parse(msg.content.toString());
              console.log("Preparing Order:", order);
              const isAvailable = await checkInventory(order);
              if (isAvailable) {
                try {
                  await axios.post(
                    `http://restaurant-service:3003/inventory/incredients-found`,
                    order,
                  );
                } catch (err) {
                  console.error("Failed to process order message:", err);
                }
              } else {
                console.log("Inventory not available.");
              }
              channel.ack(msg);
            } catch (err) {
              console.error("Failed to process message", err);
            }
          })();
        }
      },
      { noAck: false },
    );

    console.log("Waiting for messages in restaurant queue:");
  } catch (error) {
    console.error("Error in consumeOrder:", error);
  }
};

consumeOrder();
