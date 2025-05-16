const getMenu = async () => {
    try {
        const menu = await fetch("https://free-food-menus-api-two.vercel.app/best-foods");
        return menu.json();
    } catch (error) {
        throw new Error(`Fail to fetch: ${error}`);
    }

}

export default getMenu;