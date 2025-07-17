import { useState, useEffect } from "react";
import "./App.css";
import "./styles/styles.css";
import getMenu from "./services/menu-items";
import ProtectedRoute from "./routes/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { MenuItems } from "./types/menu";
import MenuPage from "./pages/MenuPage";
import CustomerOrderPage from "./pages/CustomerOrderPage";
import Checkout from "./pages/CheckoutPage";
import Success from "./pages/Success";

function App() {
  const [menu, setMenu] = useState<MenuItems[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const getMenuItems = await getMenu();
      const itemsWithImage = getMenuItems.filter(
        (item) => item.img && item.img.trim() !== "",
      );
      const topSixItems = itemsWithImage.slice(31, 37);
      setMenu(topSixItems);
    };
    fetchMenu();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<MenuPage menu={menu} />} />
      <Route path="orders" element={<CustomerOrderPage />} />
    </Routes>
  );
}

export default App;
