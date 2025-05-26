import axios from 'axios';

type MenuItem = {
    id: number;
    img: string;
    dsc: string;
    price: number;
};

const getMenu = async (): Promise<MenuItem[]> => {
    try {
        const menu = await axios.get<MenuItem[]>(
            "https://free-food-menus-api-two.vercel.app/best-foods"
        );
        return menu.data;
    } catch (error) {
        throw new Error(`Fail to fetch: ${error}`);
    }

}

export default getMenu;