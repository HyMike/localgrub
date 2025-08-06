import amqp, { ConsumeMessage } from "amqplib";
import { sendEmail } from "../utils/send-email";
import RabbitMQConnection from "./rabbitmq-connection";

const consumeOrder = async (): Promise<void> => {
  try {
    const rabbitmq = await RabbitMQConnection.getInstance();
    const channel = await rabbitmq.getChannel();

    await channel.assertExchange("topic_exc", "topic", { durable: true });

    const queueName = "orderNotifications";

    const queueRes = await channel.assertQueue(queueName, { durable: true });

    await channel.bindQueue(queueName, "topic_exc", "order.placed");

    channel.consume(
      queueRes.queue,
      async (msg: ConsumeMessage | null) => {
        try {
          if (msg) {
          const content = JSON.parse(msg.content.toString());
          console.log(`Sending Out Notifications:`, content);
          const { email, firstName, name: itemName, quantity } = content;

          const subject = `We've received your order, ${firstName}!`;
          const text = `Thanks for ordering with localgrub! We’ve 
                    successfully received your order and are about to get started. 
                    You’ll get another update once we begin preparing your food—and again 
                    when it’s ready for pickup.
                    Here’s what you ordered:${quantity} orders of ${itemName} . 
                    If you have any questions, feel free to reply to this email.
                    Thanks again for choosing us—we can’t wait to serve you!
                    Warm regards,The localgrub Team`;

          const html = `
                        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                            <h2 style="color: #e67e22;">🍴 Thanks for your order, ${firstName}!</h2>
                            <p>We’ve successfully received your order and are about to get started.</p>
                            <p>You’ll get another update once we begin preparing your food—and again when it’s ready for pickup.</p>

                            <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #e67e22;">
                            <p><strong>Order Summary:</strong></p>
                            <p>${quantity} × ${itemName}</p>
                            </div>

                            <p>If you have any questions, just reply to this email—we’re happy to help!</p>

                            <p>Thanks again for choosing <strong>localgrub</strong>—we can’t wait to serve you!</p>

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
      } catch (error){
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
consumeOrder();

export default consumeOrder