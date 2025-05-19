import amqp, { ConsumeMessage } from 'amqplib';

const consumeOrder = async (): Promise<void> => {
    try {
        const conn = await amqp.connect("amqp://localhost:5672");

        const channel = await conn.createChannel();

        const queue = 'order';

        await channel.assertQueue(queue, { durable: true });

        channel.consume(
            queue,
            (msg: ConsumeMessage | null) => {
                if (msg) {
                    try {
                        const content = JSON.parse(msg.content.toString());
                        console.log("Message Received in Restaurant:", content);

                        channel.ack(msg);
                    } catch (err) {
                        console.error("Failed to process message", err);

                    }
                }
            },
            { noAck: false }
        );

        console.log("Waiting for messages in queue:", queue);
    } catch (error) {
        console.error("Error in consumeOrder:", error);
    }
};

consumeOrder();


// import amqp, { ConsumeMessage } from 'amqplib';

// const consumeOrder = async (): Promise<void> => {
//     try {
//         const conn = await amqp.connect(
//             "amqp://localhost:5672"
//         );
//         const channel = await conn.createChannel();

//         const queue = 'order';

//         await channel.assertQueue(queue);

//         channel.consume(
//             queue,
//             (msg: ConsumeMessage | null) => {
//                 if (msg) {
//                     const content = JSON.parse(
//                         msg.content.toString());
//                     console.log("Message Received in Restaurant!");
//                     channel.ack(msg);
//                 }



//             }

//         )


//     } catch (error) {
//         console.error("Error in consumeOrder:", error);
//     }
// };
// consumeOrder();