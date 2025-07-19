import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoutes";

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

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
