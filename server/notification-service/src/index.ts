import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to deliver app!");
});
app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "alice" }]);
});

app.listen(3001, () => {
  console.log("delivery service is running on port 3001");
});
