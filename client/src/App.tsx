import "./App.css";
import "./styles/styles.css";
import ProtectedRoute from "./routes/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import MenuPage from "./pages/MenuPage";
import CustomerOrderPage from "./pages/CustomerOrderPage";
import Checkout from "./pages/CheckoutPage";
import Success from "./pages/Success";
import useMenu from "./hooks/useMenu";

function App() {
  const { menu } = useMenu();

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
