import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

app.get("/", (req, res) => {
    res.send("Welcome to deliver app!");

})
app.get("/status", (req, res) => {
    res.json({ message: "I am communicating from the backend!" });

    // const name = req.query.name;
    // res.json([{ name: name }]);
    // // res.json([{ id: 1, name: "alice" }]);
});

app.listen(PORT, () => {
    console.log("delivery service is running on port 3001");
});