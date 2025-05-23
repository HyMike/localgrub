import axios from "axios";

export type FormData = {
    id: number;
    name: string;
    img: string;
};

export const sendData = async (formData: FormData, token: string) => {
    try {
        await axios.post(
            "http://localhost:3005/success",
            {
                id: formData.id,
                name: formData.name,
                img: formData.img,
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
