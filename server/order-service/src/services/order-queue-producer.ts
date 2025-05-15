import amqp from "amqplib";

const sendOrder = async (): Promise<void> => {
    const conn = await amqp.connect('amqp://localhost:5672');
    const channel = await conn.createChannel();

    const queue = 'order';
    const msg = JSON.stringify({ name: 'Adrianne', age: 27 });

    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(msg));

    console.log("Message is sent to queue");

};

sendOrder();

