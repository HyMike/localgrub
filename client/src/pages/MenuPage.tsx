import { useAuth } from "../authentication/AuthContext";
import { MenuItems } from "../types/menu";
import NavBar from "../components/NavBar";
import MenuItemCard from "../components/MenuItemCard";
import Footer from "../components/Footer";

function MenuPage({ menu }: { menu: MenuItems[] }) {
  const { user } = useAuth();

  return (
    <div>
      <NavBar userName={user?.email ?? ""} />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-6">
        Feature Items
      </h1>
      <ul className="menu-items">
        {menu.map(({ id, img, dsc: name, price }) => (
          <MenuItemCard
            key={id}
            id={id.toString()}
            img={img}
            name={name}
            price={price}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
}

export default MenuPage;
