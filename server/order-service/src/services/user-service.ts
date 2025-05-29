import {db} from "../"
 
// export const getOrderByUserId = async (orderId: string, userId: string) => {
//   try {
//     const orderRef = db.doc(`users/${userId}/orders/${orderId}`);
//     const orderSnap = await orderRef.get(); // Firebase Admin SDK method

//     if (orderSnap.exists) {
//       return orderSnap.data(); // this is the Firestore document's data
//     } else {
//       console.log("Order not found");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     return null;
//   }
// };


export const getOrderByUserId = async (orderId: string, userId: string) => {
  try {
   const path = `users/${userId}/orders/${orderId}`;
console.log("📌 Fetching from path:", path);

const orderRef = db.doc(path);
const orderSnap = await orderRef.get();

    if (orderSnap.exists) {
      return orderSnap.data();
    } else {
      console.log("Order not found");
      return null;
    }
  } catch (error) {
    console.error("🔥 Error fetching order:", error);
    throw new Error("Failed to fetch order.");
  }
};