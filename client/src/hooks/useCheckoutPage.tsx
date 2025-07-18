import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CheckoutFormData } from "../types/checkout";

const useCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [creditCardInfo, setCreditCardInfo] = useState("");
  const formData = location.state?.formData as CheckoutFormData | null;

  useEffect(() => {
    if (!formData) {
      navigate("/");
    }
  }, [formData, navigate]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setCreditCardInfo(event.target.value);
  };

  return { formData, creditCardInfo, onChangeHandler };
};

export default useCheckoutPage;
