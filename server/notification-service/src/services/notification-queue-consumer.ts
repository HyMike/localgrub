import amqp, { ConsumeMessage } from "amqplib";

const consumeOrder = async (): Promise<void> => {
    try {
        const conn = await amqp.connect("amqp://localhost:5672");
        const channel = await conn.createChannel();

        await channel.assertExchange("topic_exc", "topic", { durable: true });

        const queueRes = await channel.assertQueue("", { exclusive: false });

        await channel.bindQueue(queueRes.queue, "topic_exc", "order.placed");

        channel.consume(
            queueRes.queue,
            (msg: ConsumeMessage | null) => {
                if (msg) {
                    const content = JSON.parse(msg.content.toString());
                    console.log(`Sending Out Notifications:`, content);

                    channel.ack(msg);
                }

            },
            { noAck: false }
        );

    } catch (error) {
        console.error("Error consuming messages:", error);
    }

}
consumeOrder();  