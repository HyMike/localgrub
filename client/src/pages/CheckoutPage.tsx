
import { useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SubmitBtn from "../components/SubmitBtn";

// interface CheckoutProps {
//   id: string;
//   name: string;
//   quantity: number;
//   price: number;
//   img: string;
// }

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [creditCardInfo, setCreditCardInfo] = useState('');

  const formData = location.state?.formData;

  if (!formData) {
    navigate("/");
    return null;
  }

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setCreditCardInfo(event.target.value);
  }

  const { id, name, quantity, price, img } = formData;
  const total = quantity * price;
  
  return (
    <div className="p-4 bg-white text-black max-w-lg mx-auto mt-10 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <img src={img} alt={name} className="w-full h-72 object-contain rounded mb-4" />
      <p><strong>Item:</strong> {name}</p>
      <p><strong>Quantity:</strong> {quantity}</p>
      <p><strong>Price:</strong> ${price}</p>
      <p className="text-lg font-semibold mt-2">Total: ${total}</p>


      <div className="mt-6">
        <label className="block mb-2">Credit Card Info (Dummy)</label>
        <input
          onChange={onChangeHandler}
          type="text"
          value={creditCardInfo}
          placeholder="1234 5678 9012 3456"
          className="w-full p-2 border rounded"
        />
      </div>
      <SubmitBtn 
      formData={formData}
      creditCardInfo={creditCardInfo} 
      toPage={"success"}
      />
    </div>
  );
};

export default Checkout;
