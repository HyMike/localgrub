import axios from "axios";

export type OrderFormData = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    creditCardInfo: string;
};

export const sendData = async (OrderFormData: OrderFormData, token: string) => {
    try {
        await axios.post(
            "http://localhost:3005/success",
            {
                id: OrderFormData.id,
                name: OrderFormData.name,
                quantity: OrderFormData.quantity,
                price: OrderFormData.price,
                creditCardInfo: OrderFormData.creditCardInfo,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Data sent successfully!");
    } catch (error) {
        console.error("There is an issue with sending your data:", error);
    }
};
