const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const chalk = require("chalk");

async function main() {
  dotenv.config({ path: "./.env.local" });

  const { PORT, DB_LINK } = process.env;
  const clientDb = new Pool({
    connectionString: DB_LINK,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.get("/hello", (req, res) => {
    try {
      console.log(chalk.red("HIT /hello"));
      res.status(200).send("Hello Tiger!");
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  app.get("/sql", async (req, res) => {
    try {
      console.log(chalk.red("HIT /sql"));
      const result = await clientDb.query("SELECT * FROM ping");
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  app.listen(PORT, async () => {
    try {
      console.log(`Server is running on Port: ${PORT}`);
      await clientDb.connect();
      console.log(`Database Postgres is connected!`);
    } catch (error) {
      console.log(`Error Connectiong to Postgres!`);
      console.log(error);
    }
  });
}
main();
