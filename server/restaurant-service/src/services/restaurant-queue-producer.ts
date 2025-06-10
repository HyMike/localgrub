import ampq, { ConsumeMessage } from 'amqplib';

type OrderType = {
    email: string;
    firstName: string;
    uid: number;
    itemName: string;
    quantity: number;
}
const orderPrepared = async (order: OrderType): Promise<void> => {

    const { email, firstName, uid, itemName, quantity } = order;

    const conn = await ampq.connect('amqp://rabbitmq:5672');
    const channel = await conn.createChannel();

    await channel.assertExchange("order_prep_exch", 'topic', {durable: true});

    let msg = {
        email,
        firstName, 
        uid, 
        itemName, 
        quantity
    };

    channel.publish("order_prep_exch", 
        "order_prepared", 
        Buffer.from(JSON.stringify(msg)),
        {persistent: true}
    );
    
    await channel.close();
    await conn.close();

}

export default orderPrepared;