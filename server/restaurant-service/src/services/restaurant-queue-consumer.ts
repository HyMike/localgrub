import amqp, { ConsumeMessage } from 'amqplib';

const consumeOrder = async (): Promise<void> => {
    try {
        const conn = await amqp.connect("amqp://localhost:5672");

        const channel = await conn.createChannel();

        await channel.assertExchange("topic_exc", "topic", { durable: true });

        const queueRes = await channel.assertQueue("", { durable: true });

        await channel.bindQueue(queueRes.queue, "topic_exc", "order.placed");

        channel.consume(
            queueRes.queue,
            (msg: ConsumeMessage | null) => {
                if (msg) {
                    try {
                        const content = JSON.parse(msg.content.toString());
                        console.log("Preparing Order:", content);

                        channel.ack(msg);
                    } catch (err) {
                        console.error("Failed to process message", err);

                    }
                }
            },
            { noAck: false }
        );

        console.log("Waiting for messages in queue:");
    } catch (error) {
        console.error("Error in consumeOrder:", error);
    }
};

consumeOrder();
