import amqp, { ConsumeMessage } from "amqplib";
import { sendEmail } from "../utils/send-email";


const notificationsOrderPrepared = async () => {
    try {

        const conn = await amqp.connect('amqp://localhost:5672');
        const channel = await conn.createChannel();


        await channel.assertExchange("order_prep_exch", "topic", {durable: true});

        const queueRes = await channel.assertQueue("", {durable: true});
        
        await channel.bindQueue(queueRes.queue, "order_prep_exch", "order_prepared");

        channel.consume(queueRes.queue, (msg: ConsumeMessage | null) => {
            if (msg) {
                const order = JSON.parse(msg.content.toString());

                    const { email,
                            firstName, 
                            uid, 
                            itemName, 
                            quantity
                        } = order;

                    const subject = `Your order is being prepared, ${firstName}`
                    const text = `Hey ${firstName}. Just a quick update—your order.
                     Your order of ${quantity} x ${itemName} is now being freshly prepared in our kitchen. We’re making 
                     sure everything is just right so it’s hot and delicious when you arrive. 
                     You’ll receive another message as soon as it’s ready for pickup.
                     Thanks for your patience and support! Hungrily yours,localgrub`


                    sendEmail(email,subject,text);
                        

                    channel.ack;
                }

        },
    {noAck: false});


    } catch (error) {
         console.error(error);
        }
}
notificationsOrderPrepared();

export default notificationsOrderPrepared;