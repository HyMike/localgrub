import amqp, { ConsumeMessage } from "amqplib";
import { sendEmail } from "../utils/send-email";


const notificationsOrderPrepared = async () => {
    try {

        const conn = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await conn.createChannel();


        await channel.assertExchange("order_prep_exch", "topic", {durable: true});

        const queueName = "orderPreparedNotification";

        const queueRes = await channel.assertQueue(queueName, {durable: true});
        
        await channel.bindQueue(queueName, "order_prep_exch", "order_prepared");

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

                     const html = `
                        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                            <h2 style="color: #f39c12;">🍳 Cooking up something delicious for you, ${firstName}!</h2>

                            <p>Just a quick update—your order is now being freshly prepared in our kitchen.</p>

                            <div style="margin: 20px 0; padding: 15px; background-color: #fef9f4; border-left: 4px solid #f39c12;">
                            <p><strong>Order Summary:</strong></p>
                            <p>${quantity} × ${itemName}</p>
                            </div>

                            <p>We’re making sure everything is hot, fresh, and just the way you like it. You’ll receive another message once your order is ready for pickup.</p>

                            <p>Thanks for your patience and support—we truly appreciate you!</p>

                            <p style="margin-top: 30px;">Hungrily yours,<br/>The <strong>localgrub</strong> Team</p>

                            <hr style="margin-top: 40px;" />
                            <footer style="font-size: 12px; color: #888;">
                            <p>localgrub | 123 Pickup Street | Foodtown, CA</p>
                            <p>Need help? <a href="mailto:support@localgrub.com">support@localgrub.com</a></p>
                            </footer>
                        </div>
                        `;

                    sendEmail(email,subject,html);
                        
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