import express from "express";

const app = express();
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Welcome to deliver app!");
});

app.listen(3001, () => {
    console.log("Payment Service is running on 3001");
});