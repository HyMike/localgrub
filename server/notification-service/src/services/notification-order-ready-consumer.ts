import amqp, { ConsumeMessage } from "amqplib";
import { sendEmail } from "../utils/send-email";

type userInfo = {
    name: string;
    email: string;
    itemName: string;
    quantity: number;
} | null

const orderReadyNotification = async (): Promise<void> => {
    try {
        const conn = await amqp.connect("amqp://localhost:5672");
        const channel = await conn.createChannel();

        await channel.assertExchange("order_ready_exch", "topic", { durable: true });

        const queueRes = await channel.assertQueue("", { exclusive: false });

        await channel.bindQueue(queueRes.queue, "order_ready_exch", "order.ready");

        channel.consume(
            queueRes.queue,
            (msg: ConsumeMessage | null) => {
                console.log("i am running!");
                if (msg) {
                    const content = JSON.parse(msg.content.toString());
                    console.log(`Sending Out Notifications:`, content);
                    const { name,
                            email,
                            itemName,
                            quantity
                    } = content;
                    
                    const subject = `Your order is ready for pickup, ${name}!`;
                    const text = `Your order of ${quantity} of ${itemName} is ready for pickup!`

                    sendEmail(email,subject,text);

                    channel.ack(msg);
                }

            },
            { noAck: false }
        );

    } catch (error) {
        console.error("Error consuming messages:", error);
    }

}
orderReadyNotification();  