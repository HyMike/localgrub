import { useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import axios from 'axios';
import { sendData } from "../utils/sendData.utils";


type FormData = {
    id: number;
    name: string;
    img: string;
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

    // await sendData(formData, token) 
    // => {
    //     try {
    //         await axios.post("http://localhost:3005/success", {
    //             //this is the food item that we are working with
    //             id: id,
    //             name: name,
    //             img: img
    //         },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 }
    //             },
    //         );
    //         console.log("Data sent successfully!");
    //         navigate("/success");

    //     } catch (error) {
    //         console.log(
    //             `There is an issue with sending your data: ${error}`);

    //     }

    // };

    return <button onClick={handleClick}>Buy Now One-Click</button>;

};


export default SubmitBtn;
