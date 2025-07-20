import { Request, Response } from "express";
import orderPrepared from "../services/restaurant-queue-producer";

const preparedOrder = async (req: Request, res: Response): Promise<void> => {
  const order = req.body;

  await orderPrepared(order);

  res.status(200).send("Order prepared");
};

export default preparedOrder;
