import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoutes";
import RabbitMQConnection from "./services/rabbitmq-connection";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:4173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use("/", orderRoutes);

const PORT = process.env.PORT || 3005;

// Initialize RabbitMQ connection on startup
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
  console.log(`Order Service running on port ${PORT}`);
  await initializeRabbitMQ();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  const rabbitmq = RabbitMQConnection.getInstance();
  await rabbitmq.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  const rabbitmq = RabbitMQConnection.getInstance();
  await rabbitmq.close();
  process.exit(0);
});
