import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "./styles/styles.css";
import getMenu from './menu-items';
import axios from 'axios';
import ProtectedRoute from './routes/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Success from './Success';
import SignUp from './components/SignUp';


type MenuItems = {
  id: number;
  dsc: string;
  img: string;
};

//when the button clicks it should reroute to the success page and send an api post to the order service. 
const handleBtnClick = async (id: number, name: string, img: string) => {
  try {
    await axios.post("http://localhost:3005", {
      id: id,
      name: name,
      img: img
    });


  } catch (error) {
    console.log(`There is an issue with sending your data: ${error}`);

  }


}

function App() {
  const [menu, setMenu] = useState<MenuItems[]>([]);

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

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* <Route
            path="/"
            element={
              <ProtectedRoute>
               
              </ProtectedRoute>
            }
          /> */}
        </Routes>

      </Router>

      <div>
        <h1>Menu Items</h1>
        <ul className="menu-items">
          {menu.map(({ id, img, dsc: name }) => {

            return (
              <li key={id} className='menu-card'>
                <img src={img} width="300" height="300" />
                <h3>{name}</h3>
                <div className='button'>
                  <button onClick={() => handleBtnClick(id, name, img)}>One Click Purchase</button>
                </div>
              </li>
            )
          }
          )}
        </ul>

      </div>


    </>
  )
}

export default App

