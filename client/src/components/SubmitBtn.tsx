import { useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import { sendData } from "../utils/sendData.utils";

type FormData = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    img?: string;
    // creditCardInfo?: string;
}

type Props = {
    formData: FormData;
    toPage: string;
    creditCardInfo?: string;
    btnTxt: string;
};


// this now just pass the data into the checkout page. and you would do the submit and sendData there. 
const SubmitBtn = ({ formData, toPage, creditCardInfo= "", btnTxt="" }: Props) => {

    const { user, loading } = useAuth();
    const navigate = useNavigate();
    if (loading) return null;


    //formdata is not passing the credit card information. 

    const handleClick = async () => {
          const newData = {
            ...formData,
            creditCardInfo
        };

        if (!user) {
            navigate("/login", {
                state: {
                    formData: newData,
                    from: `/${toPage}`
                }
            });
        } else {
            try {
                const token = await user.getIdToken();
                
                navigate(`/${toPage}`, {
                    state: {
                        formData: newData,
                        from:`/${toPage}`
                    }
                });

                if (toPage === "success") {
                    await sendData(newData, token);
                }

             
            } catch (err) {
                console.error("Failed to get token or send data:", err);
            }
        }
    };

    return <button onClick={handleClick}>{btnTxt}</button>;

};


export default SubmitBtn;
