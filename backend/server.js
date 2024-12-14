const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const chalk = require("chalk");
const { waitFor } = require("./helpers/wait");

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

  app.get("/db/habits/all", async (req, res) => {
    try {
      console.log(chalk.red("HIT /db/habits/all"));
      const result = await clientDb.query(
        `SELECT h.id, h.habit_name, h.start_date, h.end_date, 
        h.created_by_user_id, h.created_at, u.email_id, hm.total_joined,
        u.user_name, u.user_img  FROM habits as h LEFT JOIN habits_metadata 
        as hm ON hm.habit_id =  h.id
        LEFT JOIN users as u ON u.id = h.created_by_user_id`
      );
      res.status(200).send({ rowCount: result.rowCount, rows: result.rows });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
  app.get("/db/habits/details/:habitId", async (req, res) => {
    try {
      const habitId = parseInt(req.params.habitId);
      console.log(
        chalk.red(`HIT /db/habits/details/:habitId, habitId : ${habitId}`)
      );
      const result = await clientDb.query(
        `SELECT h.id, h.habit_name, h.created_by_user_id, 
        h.created_at,  hc.checkpoint_name, hc.deadline FROM habits as h  
        LEFT JOIN habits_checkpoints as hc 
        ON hc.habit_id = h.id WHERE h.id = $1::integer`,
        [habitId]
      );
      res.status(200).send({ rowCount: result.rowCount, rows: result.rows });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
  app.get("/db/users/details/:emailId", async (req, res) => {
    try {
      const emailId = req.params.emailId;
      console.log(
        chalk.red(`HIT /db/users/details/:emailId, emailId : ${emailId}`)
      );
      const result = await clientDb.query(
        `SELECT u.id, u.email_id, u.user_name, 
        u.user_img,  u.created_at FROM users as u  
        WHERE u.email_id = $1::varchar`,
        [emailId]
      );
      res.status(200).send({ rowCount: result.rowCount, rows: result.rows });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
    async function connectToPostgres(count) {
      try {
        await clientDb.connect();
        console.log(`Database Postgres is connected!`);
      } catch (error) {
        console.log(`Error Connectiong to Postgres!`);
        console.log(error);
        if (count === 5) {
          console.log("Failed to connected to Database postgres!");
          return;
        }
        await waitFor(3000);
        connectToPostgres(count + 1);
      }
    }
    connectToPostgres(0);
  });
}
main();
