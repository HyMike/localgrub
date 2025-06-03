import { collection, getDoc, getDocFromServer, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useEffect, useState } from "react";
import axios from "axios";


type Order = {
  orderId: string;
  itemName: string;
  quantity: number;
  userId: string;
  firstName: string;
  lastName: string;
};


const getAllOrdersForAllUsers = async (): Promise<[]> => {
    const userRef = await collection(db, 'users');
    const userSnapshots = await getDocs(userRef);


    const allOrders: any[] = [];



    for (const userDoc of userSnapshots.docs) {
        const userId = userDoc.id;
        const firstName = userDoc.data().firstName;
        const lastName = userDoc.data().lastName;
        const ordersRef = collection(db, `users/${userId}/orders`);
        const orderSnapshots = await getDocs(ordersRef);
        

        const userOrders = orderSnapshots.docs.map((doc) => ({
            orderId: doc.id,
            userId,
            firstName, 
            lastName,
            ...doc.data(),
        }));

        allOrders.push(userOrders);

    }

    return allOrders;

};

const CustomerOrderPage = () => {
  const [allOrders, setAllOrders] = useState<Order[][]>([]);
  const [readyOrder, setReadyOrder] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrdersForAllUsers();
      setAllOrders(orders);
    };
    fetchOrders();
  }, []);

  const handleReadyClick = async (orderId: string, userId: string) => {
    setReadyOrder((prev) => new Set(prev).add(orderId));
    try {
      await axios.post("http://localhost:3005/order-ready", { orderId, userId });
    } catch (error) {
      console.error(error);
    }
  };

  const totalOrders = allOrders.flat().length;
  const completedCount = allOrders.flat().filter((order) => readyOrder.has(order.orderId)).length;
  const pendingCount = totalOrders - completedCount;

    //make API call to firestore to modify the status to completed. 
    // which then triggers producer to emit producer to notifiy the customer order is ready for pickup.

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Customer Orders</h2>
        <p className="text-gray-500">Track and manage customer orders</p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-sm text-gray-500">Pending</p>
          <h3 className="text-2xl font-bold text-yellow-500">{pendingCount}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-sm text-gray-500">Completed</p>
          <h3 className="text-2xl font-bold text-green-600">{completedCount}</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h4 className="text-lg font-semibold text-gray-900">Customer Orders ({totalOrders})</h4>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="text-left p-4">Item</th>
              <th className="text-left p-4">Quantity</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.flat().map(({ orderId, userId, itemName, quantity, firstName, lastName }) => (
              <tr key={orderId} className="border-t hover:bg-gray-50">
                <td className="p-4">{itemName}</td>
                <td className="p-4">
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">{quantity}x</span>
                </td>
                <td className="p-4">{firstName} {lastName}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      readyOrder.has(orderId)
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {readyOrder.has(orderId) ? "Completed" : "Not Ready"}
                  </span>
                  {!readyOrder.has(orderId) && (
                    <button
                      onClick={() => handleReadyClick(orderId, userId)}
                      className="ml-3 text-sm text-blue-600 hover:underline"
                    >
                      Mark Ready
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// const CustomerOrderPage = () => {
//   const [allOrders, setAllOrders] = useState<Order[][]>([]);
//   const [readyOrder, setReadyOrder] = useState<Set<string>>(new Set());

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const orders = await getAllOrdersForAllUsers();
//       setAllOrders(orders);
//     };

//     fetchOrders();
//   }, []);

//      const handleReadyClick = async (orderId: string, userId: string) => {
//       setReadyOrder((previous)=> new Set(previous).add(orderId));

//       try {
//         const response = await axios.post("http://localhost:3005/order-ready", {
//           orderId: orderId,
//           userId: userId
//         });

//       } catch (error) {
//         console.error(error);
//       }

//       //make API call to firestore to modify the status to completed. 
//       // which then triggers producer to emit producer to notifiy the customer order is ready for pickup. 
//   };

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold mb-4">Customer Orders</h2>

//       <table className="w-full border border-gray-300 text-left shadow-md rounded">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="py-2 px-4 border-b">Item</th>
//             <th className="py-2 px-4 border-b">Quantity</th>
//             <th className="py-2 px-4 border-b">Name</th>
//             <th className="py-2 px-4 border-b">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {allOrders.flat().map(({ orderId, userId, itemName, quantity, firstName, lastName }) => (
//             <tr key={orderId} className="hover:bg-gray-50">
//               <td className="py-2 px-4 border-b">{itemName}</td>
//               <td className="py-2 px-4 border-b">{quantity}</td>
//               <td className="py-2 px-4 border-b">{firstName} {lastName}</td>
//               <td className="py-2 px-4 border-b">
//                 <button
//                   onClick={() => handleReadyClick(orderId,userId)}
//                   className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-3 rounded"
//                 >
//                   { readyOrder.has(orderId) ? "Completed" : "Not Ready"}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };


export default CustomerOrderPage;





//grab all orders from the firebase
//map it in a list. 
//then put it in a table. 

