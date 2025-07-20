import express from "express";
import RabbitMQConnection from "./service/rabbitmq-connection";

const app = express();
app.use(express.json());

const initializeRabbitMQ = async () => {
  try {
    const rabbitmq = RabbitMQConnection.getInstance();
    await rabbitmq.getConnection();
    console.log("RabbitMQ connection initialized");
  } catch (error) {
    console.error("Failed to initialize RabbitMQ:", error);
  }
};  

process.on('SIGTERM', async () =>{
  const rabbitmq = RabbitMQConnection.getInstance();
  await rabbitmq.close();
  process.exit(0);
});

process.on('SIGINT', async () =>{
  const rabbitmq = RabbitMQConnection.getInstance();
  await rabbitmq.close();
  process.exit(0);
});


app.listen(3001, async () => {
  await initializeRabbitMQ();
  console.log("Payment Service is running on 3001");
});