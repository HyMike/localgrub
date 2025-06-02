import { useState } from "react";

type QuantityBtnProps = {
    onQuantityChange: (quantity: number) => void;
}

export const QuantityBtn = ({ onQuantityChange }: QuantityBtnProps) => {
    const [quantity, SetQuantity] = useState(1);


    const handleQuantity = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget.textContent === "+") {
            const quantitySum = quantity + 1;
            SetQuantity(quantitySum);
            onQuantityChange(quantitySum);
        } else {
            const quantityDiff = Math.max(1, quantity - 1)
            SetQuantity(quantityDiff);
            onQuantityChange(quantityDiff);
        }
    };

    return (
        <div className="flex items-center justify-around w-full max-w-sm mb-5 ">
            <label className="text-base leading-none mr-4">Quantity</label>

            <div className="flex items-center space-x-2">
                <button
                    className="w-8 h-8 bg-blue-400 text-white rounded-md flex items-center justify-center text-lg"
                    onClick={handleQuantity}
                >
                    -
                </button>
                <span className="text-base">{quantity}</span>
                <button
                    className="w-8 h-8 bg-blue-400 text-white rounded-md flex items-center justify-center text-lg"
                    onClick={handleQuantity}
                >
                    +
                </button>
            </div>
        </div>
    );




}