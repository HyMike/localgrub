import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../authentication/AuthContext";
import { Order } from "../types/CustomerOrder";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import axios from "axios";

const getAllOrdersForAllUsers = async (): Promise<Order[]> => {
  const userRef = await collection(db, "users");
  const userSnapshots = await getDocs(userRef);

  const allOrders: Order[] = [];

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

    allOrders.push(...userOrders as Order[]);
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

export const useCustomerOrderPage = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [readyOrder, setReadyOrder] = useState<Set<string>>(new Set());
  const { user, superuser, loading } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const orders = superuser
        ? await getAllOrdersForAllUsers()
        : await getOrdersForUser(user.uid);
      setAllOrders(orders);

    };
    fetchOrders();
  }, [user, superuser]);

  const handleReadyClick = async (orderId: string, userId: string) => {
    setReadyOrder((prev) => new Set(prev).add(orderId));
    try {
      await axios.post("http://localhost:3005/order-ready", {
        orderId,
        userId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return { allOrders, readyOrder, handleReadyClick, user };
};
