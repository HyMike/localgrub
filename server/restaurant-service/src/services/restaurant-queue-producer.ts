import ampq, { ConsumeMessage } from "amqplib";
import RabbitMQConnection from "./rabbitmq-connection";
import { OrderType } from "../db/types/OrderType";

const orderPrepared = async (order: OrderType): Promise<void> => {
  const { email, firstName, uid, name: itemName, quantity } = order;

  const rabbitmq = await RabbitMQConnection.getInstance();
  const channel = await rabbitmq.getChannel();

  await channel.assertExchange("order_prep_exch", "topic", { durable: true });

  let msg = {
    email,
    firstName,
    uid,
    itemName,
    quantity,
  };

  channel.publish(
    "order_prep_exch",
    "order_prepared",
    Buffer.from(JSON.stringify(msg)),
    { persistent: true },
  );
};

export default orderPrepared;
