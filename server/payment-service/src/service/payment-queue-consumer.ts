import amqp, { ConsumeMessage } from "amqplib";

const consumeOrder = async (): Promise<void> => {
  try {
    const connection = await amqp.connect("amqp://rabbitmq:5672");
    const channel = await connection.createChannel();

    await channel.assertExchange("topic_exc", "topic", { durable: true });

    const queueName = "paymentQueue";

    const queueRes = await channel.assertQueue(queueName, { exclusive: false });

    await channel.bindQueue(queueName, "topic_exc", "order.*");

    channel.consume(
      queueRes.queue,
      (msg: ConsumeMessage | null) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());

            console.log(`Payment Received from:`, content);

            channel.ack(msg);
          } catch (error) {
            console.log(error);
          }
        }
      },
      { noAck: false },
    );

    console.log("Waiting for messages in queue for Payment Service:");
  } catch (error) {
    console.log(`Error in making connection: ${error}`);
  }
};

consumeOrder();
