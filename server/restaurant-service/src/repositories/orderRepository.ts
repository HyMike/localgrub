import pool from "../db/index";
import orderPrepared from "../services/restaurant-queue-producer";
import { OrderType } from "../db/types/OrderType";

const checkInventory = async (order: OrderType) => {
  const { name: itemName, quantity } = order;

  const result = await pool.query(
    "SELECT * FROM inventory WHERE item = $1 AND quantity >= $2",
    [itemName, quantity],
  );

  if (result.rows.length === 0) {
    console.log(
      `Insufficient inventory for ${itemName} - requested: ${quantity}`,
    );
    return false;
  } else {
    const item = result.rows[0];
    if (item.incredients_available) {
      return true;
    }
  }
};
export default checkInventory;
