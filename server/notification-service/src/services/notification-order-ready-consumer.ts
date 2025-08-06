import amqp, { ConsumeMessage } from "amqplib";
import { sendEmail } from "../utils/send-email";
import RabbitMQConnection from "./rabbitmq-connection";

const orderReadyNotification = async (): Promise<void> => {
  try {
    const rabbitmq = await RabbitMQConnection.getInstance();
    const channel = await rabbitmq.getChannel();
    await channel.assertExchange("order_ready_exch", "topic", {
      durable: true,
    });

    const queueName = "orderReadyNotification";

    const queueRes = await channel.assertQueue(queueName, { durable: true });

    await channel.bindQueue(queueName, "order_ready_exch", "order.ready");

    channel.consume(
      queueRes.queue,
      async (msg: ConsumeMessage | null) => {
        try {
          if (msg) {
            const content = JSON.parse(msg.content.toString());
            console.log(`Sending Out Notifications:`, content);
            const { name, email, itemName, quantity } = content;

            const subject = `Your order is ready for pickup, ${name}!`;
            const text = `Your order of ${quantity} of ${itemName} is ready for pickup!`;
            const html = `
                        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                            <h2 style="color: #27ae60;">✅ Your order is ready, ${name}!</h2>
                            <p>We’ve just finished preparing your meal—it’s hot and ready for you to pick up!</p>

                            <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #27ae60;">
                            <p><strong>Order Summary:</strong></p>
                            <p>${quantity} × ${itemName}</p>
                            </div>

                            <p>Come by when you’re ready. If you have any questions, feel free to reply to this email.</p>

                            <p>Thank you for ordering with <strong>localgrub</strong>!</p>

                            <p style="margin-top: 30px;">Warm regards,<br/>The localgrub Team</p>

                            <hr style="margin-top: 40px;" />
                            <footer style="font-size: 12px; color: #888;">
                            <p>localgrub | 123 Pickup Street | Foodtown, CA</p>
                            <p>Need help? <a href="mailto:support@localgrub.com">support@localgrub.com</a></p>
                            </footer>
                        </div>
                        `;
            await sendEmail(email, subject, html);

            channel.ack(msg);
          }
        } catch (error) {
          console.error("Error processing message:", error);
          if (msg) {
            channel.nack(msg, false, false);
          }
        }
      },
      { noAck: false },
    );
  } catch (error) {
    console.error("Error consuming messages:", error);
  }
};
orderReadyNotification();

export default orderReadyNotification;
