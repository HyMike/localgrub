import { useAuth } from "../authentication/AuthContext";
import { MenuItems } from "../types/menu";
import NavBar from "../components/NavBar";
import MenuItemCard from "../components/MenuItemCard";


function MenuPage({ menu }: { menu: MenuItems[] }) {
    const { user } = useAuth();

    return (
        <div>
            <NavBar userName={user?.email} />
            <h1>Menu Items</h1>
            <ul className="menu-items">
                {menu.map(({ id, img, dsc: name, price }) => (
                    <MenuItemCard key={id} id={id} img={img} name={name} price={price} />
                ))}
            </ul>
        </div>
    );
}

export default MenuPage;