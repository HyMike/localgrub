import { useState, useEffect, use } from 'react'
import './App.css'
import "./styles/styles.css";
import getMenu from './services/menu-items';
import axios from 'axios';
import ProtectedRoute from './routes/ProtectedRoute';
import { useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SuccessPage from './pages/SuccessPage';
import SignUp from './components/SignUp';
import SubmitBtn from "./components/SubmitBtn";
import { useAuth } from './authentication/AuthContext';
import LogOutBtn from './components/LogOutBtn';
import NavBar from "./components/NavBar";



type MenuItems = {
  id: number;
  dsc: string;
  img: string;
};

function App() {
  const [menu, setMenu] = useState<MenuItems[]>([]);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const menuItems = async () => {
      const getMenuItems = await getMenu();
      const itemsWithImage = getMenuItems.filter(
        (item: MenuItems) => {
          return item.img && item.img.trim() !== "";
        })
      const topSixItems = itemsWithImage.slice(2, 8);

      setMenu(topSixItems);
    }
    menuItems();
  }, []);

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>

    );
  }

  if (location.pathname === "/success") {
    return (
      <Routes>
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    )

  }

  return (
    <>
      <Routes>
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <NavBar userName={user?.email} />
              <h1>Menu Items</h1>
              <ul className="menu-items">
                {menu.map(({ id, img, dsc: name }) => {
                  return (
                    <li key={id} className='menu-card'>
                      <img src={img} width="300" height="300" />
                      <h3>{name}</h3>
                      <div className='button'>
                        <SubmitBtn formData={{ id, name, img }} />
                      </div>
                    </li>
                  )
                }
                )}
              </ul>
            </div>
          }
        >
        </Route>
      </Routes>
      {/* <div>

        <NavBar userName={user?.email} />

        <h1>Menu Items</h1>
        <ul className="menu-items">
          {menu.map(({ id, img, dsc: name }) => {

            return (
              <li key={id} className='menu-card'>
                <img src={img} width="300" height="300" />
                <h3>{name}</h3>
                <div className='button'>
                  <SubmitBtn formData={{ id, name, img }} />
                </div>
              </li>
            )
          }
          )}
        </ul>

      </div> */}
    </>
  )
}

export default App

