import { useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import { sendData } from "../utils/sendData.utils";


type FormData = {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

type Props = {
    formData: FormData;
};



const SubmitBtn = ({ formData }: Props) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    if (loading) return null;

    const handleClick = async () => {
        if (!user) {
            navigate("/login", {
                state: {
                    formData,
                    from: "/success"
                }
            });
        } else {
            try {
                const token = await user.getIdToken();
                navigate("/success");
                await sendData(formData, token);
            } catch (err) {
                console.error("Failed to get token or send data:", err);
            }
        }
    };

    return <button onClick={handleClick}>Buy Now One-Click</button>;

};


export default SubmitBtn;
