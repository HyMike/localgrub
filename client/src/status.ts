const getStatus = async () => {
    try {
        const res = await fetch("http://localhost:3001/status");
        return res.json();
    } catch (error) {
        throw new Error(`Fail to fetch: ${error}`);
    }

}

export default getStatus;