import amqp, { ConsumeMessage } from "amqplib";
import { sendEmail } from "../utils/send-email";

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
                    const { userEmail,
                            firstName,
                            itemName,
                            quantity
                    } = content;
                    

                    const subject = `We've received your order, ${firstName}!`;
                    const text = `Thanks for ordering with localgrub! We’ve 
                    successfully received your order and are about to get started. 
                    You’ll get another update once we begin preparing your food—and again 
                    when it’s ready for pickup.
                    Here’s what you ordered: ${itemName} x ${quantity}. 
                    If you have any questions, feel free to reply to this email.
                    Thanks again for choosing us—we can’t wait to serve you!
                    Warm regards,The localgrub Team`
                    
                    sendEmail(userEmail,subject,text);


                    
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