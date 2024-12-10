const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

dotenv.config({ path: "./.env.local" });

const { PORT } = process.env;

app.get("/hello", (req, res) => {
  try {
    res.status(200).send("Hello Tiger!");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
