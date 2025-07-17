import express, { Request, Response } from "express";
import setupDatabase from "./db/setup";
import orderPrepared from "./services/restaurant-queue-producer";

type OrderType = {
  email: string;
  firstName: string;
  uid: number;
  itemName: string;
  quantity: number;
};

const app = express();
app.use(express.json());

setupDatabase();

app.post(
  "/incredients-found",
  async (req: Request<{}, {}, OrderType>, res: Response): Promise<any> => {
    const order = req.body;

    if (order) {
      orderPrepared(order);
    }

    res.status(200).send("Order processed");
  },
);

app.listen(3003, () => {
  console.log("Restaurant service is running on port 3003");
});
