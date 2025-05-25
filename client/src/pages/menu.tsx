import { useAuth } from "../authentication/AuthContext";
import { MenuItems } from "../types/menu";
import NavBar from "../components/NavBar";
import SubmitBtn from "../components/SubmitBtn";
import { ButtonHTMLAttributes, useState } from "react";
import { QuantityBtn } from "../components/quantityBtn";


function MenuPage({ menu }: { menu: MenuItems[] }) {
    const { user } = useAuth();
    return (
        <div>
            <NavBar userName={user?.email} />
            <h1>Menu Items</h1>
            <ul className="menu-items">
                {menu.map(({ id, img, dsc: name }) => (
                    <li key={id} className="menu-card">
                        <img src={img} width="300" height="300" />
                        <h3>{name}</h3>
                        {/* <div className="quantity-btn">  */}
                        <QuantityBtn />
                        {/* </div> */}
                        <div className="button">
                            <SubmitBtn formData={{ id, name, img }} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MenuPage;