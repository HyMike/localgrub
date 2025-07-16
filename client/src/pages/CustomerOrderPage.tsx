import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../authentication/AuthContext";
import Navbar from "../components/NavBar";
// import { useAuth } from "../authentication/AuthContext";


type Order = {
  orderId: string;
  itemName: string;
  quantity: number;
  userId: string;
  firstName: string;
  lastName: string;
};


//if user == superuser then I should use this function. 
const getAllOrdersForAllUsers = async (): Promise<Order[]> => {
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

const getOrdersForUser = async (userId: string): Promise<Order[]> => {
  const userDoc = await getDocs(collection(db, `users/${userId}/orders`));
  const parentUser = await getDocs(collection(db, "users"));
  let firstName = "";
  let lastName = "";

  parentUser.forEach((doc) => {
  if (doc.id === userId) {
    firstName = doc.data().firstName;
    lastName = doc.data().lastName;
  }
  });

  const orders = userDoc.docs.map((doc) => ({
    orderId: doc.id,
    userId,
    firstName,
    lastName,
    ...doc.data(),
  })) as Order[];

  return orders;
};

const CustomerOrderPage = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [readyOrder, setReadyOrder] = useState<Set<string>>(new Set());
  const { user, superuser, loading } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const orders = superuser 
        ? await getAllOrdersForAllUsers()
      : await getOrdersForUser(user.uid); 
      // const orders = await getAllOrdersForAllUsers();
      setAllOrders(orders);
    };
    fetchOrders();
  }, [user, superuser]);

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
    <>
    <Navbar userName={user?.email ?? "Guest"} />
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
    </>
 
  );
};


export default CustomerOrderPage;
