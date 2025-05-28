import express from "express";
import setupDatabase from "./db/setup";

const app = express();
app.use(express.json());



app.get("/", (req, res) => {
    res.send("Welcome to deliver app!");

})
app.get("/users", (req, res) => {
    res.json([{ id: 1, name: "alice" }]);
});

app.listen(3003, () => {
    console.log("Restaurant service is running on port 3003");
});

setupDatabase();

