import { useState, useEffect, } from 'react'
import './App.css'
import "./styles/styles.css";
import getMenu from './services/menu-items';
import ProtectedRoute from './routes/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SuccessPage from './pages/SuccessPage';
import SignUp from './components/SignUp';
import { MenuItems } from './types/menu';
import MenuPage from './pages/menu';



function App() {
  const [menu, setMenu] = useState<MenuItems[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const getMenuItems = await getMenu();
      const itemsWithImage = getMenuItems.filter(
        (item: MenuItems) => item.img && item.img.trim() !== ''
      );
      const topSixItems = itemsWithImage.slice(2, 8);
      setMenu(topSixItems);
    };
    fetchMenu();
  }, []);

  return (

    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <SuccessPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<MenuPage menu={menu} />} />
    </Routes>
  );
}

export default App
