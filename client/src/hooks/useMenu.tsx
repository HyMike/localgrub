import { MenuItems } from "../types/menu";
import { useState, useEffect } from "react";
import getMenu from "../services/menu-items";

const useMenu = () => {
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

  return { menu };
};

export default useMenu;
