import express from "express";
import RabbitMQConnection from "./services/rabbitmq-connection";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  await initializeRabbitMQ();
  console.log("delivery service is running on port 3001");
});

const initializeRabbitMQ = async () => {
  try {
    const rabbitmq = RabbitMQConnection.getInstance();
    await rabbitmq.getConnection();
    console.log("RabbitMQ connection initialized");
  } catch (error) {
    console.error("Failed to initialize RabbitMQ:", error);
  }
};

process.on("SIGTERM", async () => {
  const rabbitmq = RabbitMQConnection.getInstance();
  await rabbitmq.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  const rabbitmq = RabbitMQConnection.getInstance();
  await rabbitmq.close();
  process.exit(0);
});
