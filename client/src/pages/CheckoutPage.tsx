
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SubmitBtn from "../components/SubmitBtn";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [creditCardInfo, setCreditCardInfo] = useState('');

  const formData = location.state?.formData;
  console.log(formData);

  useEffect(()=> {
    if (!formData) {
      navigate("/");
    }

  }, [formData, navigate])

  if (!formData) {
    // navigate("/");
    return null;
  }

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setCreditCardInfo(event.target.value);
  }

  const { id, name, quantity, price, img } = formData;
  const total = quantity * price;
  
  return (
  <div className="p-6 bg-white text-black max-w-2xl mx-auto mt-10 shadow-2xl rounded-xl border border-gray-200">
  
    <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>

    <div className="flex flex-col md:flex-row gap-6 mb-6">
      <img
        src={img}
        alt={name}
        className="w-full md:w-1/2 h-64 object-cover rounded-lg border"
      />
    <div className="flex-1 space-y-2 text-gray-700">
      <p><span className="font-semibold">Item:</span> {name}</p>
      <p><span className="font-semibold">Quantity:</span> {quantity}</p>
      <p><span className="font-semibold">Price:</span> ${price}</p>

      <hr className="my-4 border-t border-gray-300" />

      <p className="text-xl font-bold text-gray-900">Total: ${total}</p>
    </div>
    </div>

     <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
      <p className="text-gray-700">
        <span className="font-medium">Estimated Pickup Time:</span> 10~15 minutes
      </p>
    </div>



    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Credit Card Information
      </label>
      <input
        onChange={onChangeHandler}
        type="text"
        value={creditCardInfo}
        placeholder="1234 5678 9012 3456"
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>


    <div className="mt-8">
      <SubmitBtn
        formData={formData}
        creditCardInfo={creditCardInfo}
        toPage="success"
        btnTxt="Complete Your Purchase"
      />
    </div>
  </div>
);
  
};

export default Checkout;
