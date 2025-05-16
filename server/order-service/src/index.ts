import express, { Request, Response } from "express";
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());


type Order = {
    id: number;
    name: string;
    img: string;
};


app.get("/", (req, res) => {
    res.send("Welcome to deliver app!");

})

app.post("/", (req: Request, res: Response) => {
    const { id, name, img } = req.body as Order;

    if (!id || !name || !img) {
        return res.status(400).json({ message: "Missing fields in request" });
    }

    console.log("Received Order:", { id, name, img });

    res.status(201).json({ message: "order received succesfully" });

});
app.get("/users", (req, res) => {
    res.json([{ id: 1, name: "alice" }]);
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log("delivery service is running on port 3005");
});