import express, { Request, Response } from "express";
import setupDatabase from "./db/setup";
import orderPrepared from "./services/restaurant-queue-producer";
import RabbitMQConnection from "./services/rabbitmq-connection";
import { OrderType } from "./db/types/OrderType";
import inventoryRoutes from "./routes/inventory-routes";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3003;

setupDatabase();

app.use("/inventory", inventoryRoutes);

const initializeRabbitMQ = async () => {
  try {
    const rabbitmq = RabbitMQConnection.getInstance();
    await rabbitmq.getConnection();
    console.log("RabbitMQ connection initialized");
  } catch (error) {
    console.error("Failed to initialize RabbitMQ:", error);
  }
};

app.listen(PORT, async () => {
  await initializeRabbitMQ();
  console.log("Restaurant service is running on port 3003");
});

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
