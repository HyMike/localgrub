import amqp, { ConsumeMessage } from 'amqplib';
import checkInventory from '../repositories/orderRepository';

const consumeOrder = async (): Promise<void> => {
    try {
        const conn = await amqp.connect("amqp://rabbitmq:5672");

        const channel = await conn.createChannel();

        await channel.assertExchange("topic_exc", "topic", { durable: true });

        const queueRes = await channel.assertQueue("", { durable: true });

        await channel.bindQueue(queueRes.queue, "topic_exc", "order.placed");

        channel.consume(
            queueRes.queue,
            (msg: ConsumeMessage | null) => {
                if (msg) {
                    try {
                        const order = JSON.parse (msg.content.toString());
                        console.log("Preparing Order:", order);
                        
                        //pass entire order into it. 
                        // const item = order.itemName; 
                        // const quantity = order.quantity;
                        //make a call to your main logic and the main logic would make a call to the producer. 
                        checkInventory(order);
                        channel.ack(msg);
                    } catch (err) {
                        console.error("Failed to process message", err);

                    }
                }
            },
            { noAck: false }
        );

        console.log("Waiting for messages in restaurant queue:");
    } catch (error) {
        console.error("Error in consumeOrder:", error);
    }
};

consumeOrder();
