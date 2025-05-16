import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import getMenu from './menu-items'
import "./styles/styles.css";


type MenuItems = {
  id: number;
  dsc: string;
  img: string;
};

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
      <h1>Menu Items</h1>
      <ul className="menu-items">
        {menu.map((item) => (
          <li key={item.id}>
            <img src={item.img} width="300 " height="300" />
            <h3>{item.dsc}</h3>
          </li>
        )
        )}
      </ul>
    </>
  )
}

export default App

