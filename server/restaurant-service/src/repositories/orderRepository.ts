import pool from "../db/index";
import orderPrepared from "../services/restaurant-queue-producer";
import { OrderType } from "../db/types/OrderType";

const checkInventory = async (order: OrderType) => {
  const { name: itemName } = order;

  const result = await pool.query("SELECT * FROM inventory WHERE item = $1", [
    itemName,
  ]);

  if (result.rows.length === 0) {
    console.log("No such item found in inventory");
    return false;
  } else {
    const item = result.rows[0];
    // if item available then send producer to say order preparing in the producer.
    if (item.incredients_available) {
      return true;
      // orderPrepared(order);
    }
  }
};
export default checkInventory;
