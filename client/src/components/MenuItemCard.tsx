import { useState } from "react";
import { QuantityBtn } from "./QuantityBtn";
import SubmitBtn from "./SubmitBtn";


function MenuItemCard({ id, name, img, price }: { id: string, name: string, img: string, price: number }) {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (q: number) => {
        setQuantity(q);
    };

    const formData = { id, name, quantity, price, img };

    return (    
    
        <li className="menu-card">
            <img src={img} width="300" height="300" />
            <h3>{name}</h3>
            <QuantityBtn onQuantityChange={handleQuantityChange} />
            <div className="button">
                <SubmitBtn formData={formData} toPage={"checkout"} btnTxt="Buy Now With 1-Click" />
            </div>

            <div className="mt-2">
                <p>Pickup with 10-15 mins</p>
            </div>
        </li>
    );
}


export default MenuItemCard;
