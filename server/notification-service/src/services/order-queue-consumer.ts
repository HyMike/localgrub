import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";

const consumeOrder = async (): Promise<void> => {
    try {
        const conn = await amqp.connect("amqp://localhost:5672");
        const channel = await conn.createChannel();

        const queue = 'order';

        await channel.assertQueue(queue);

        console.log('Waiting for response');

        channel.consume(queue, (msg: ConsumeMessage | null) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());
                console.log(`received message ${content.name}`);


                channel.ack(msg);
            }

        });


    } catch (error) {
        console.error("Error consuming messages:", error);



    }

}
consumeOrder();  