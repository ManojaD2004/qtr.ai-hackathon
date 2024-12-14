const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const format = require("pg-format");
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

  app.get("/db/v1/habits/all", async (req, res) => {
    try {
      console.log(chalk.red("HIT /db/v1/habits/all"));
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
  app.get("/db/v1/habits/details/:habitId", async (req, res) => {
    try {
      const habitId = parseInt(req.params.habitId);
      console.log(
        chalk.red(`HIT /db/v1/habits/details/:habitId, habitId : ${habitId}`)
      );
      const result = await clientDb.query(
        `SELECT h.id, h.habit_name, h.start_date, h.end_date, 
        h.created_by_user_id, h.created_at, u.email_id, hm.total_joined,
        u.user_name, u.user_img  FROM habits as h LEFT JOIN habits_metadata 
        as hm ON hm.habit_id =  h.id LEFT JOIN users as u ON u.id 
        = h.created_by_user_id WHERE h.id = $1::integer`,
        [habitId]
      );
      res.status(200).send({ rowCount: result.rowCount, rows: result.rows });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
  app.get("/db/v1/habits/details/checkpoints/:habitId", async (req, res) => {
    try {
      const habitId = parseInt(req.params.habitId);
      console.log(
        chalk.red(
          `HIT /db/v1/habits/details/checkpoints/:habitId, habitId : ${habitId}`
        )
      );
      const result = await clientDb.query(
        `SELECT hc.id,  hc.checkpoint_name, 
        hc.deadline FROM habits as h  
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
  app.post("/db/v1/habits/create", async (req, res) => {
    try {
      await clientDb.query("BEGIN");
      await clientDb.query("SET TIME ZONE 'Asia/Kolkata';");
      const habitDetails = req.body;
      console.log(chalk.red(`HIT /db/v1/habits/create`));
      const resultId = await clientDb.query(
        `INSERT INTO habits (habit_name,
      start_date, end_date, created_by_user_id) 
      VALUES ($1::varchar, $2::timestamp, $3::timestamp, 
       $4::integer) RETURNING id;`,
        [
          habitDetails.habitName,
          habitDetails.startDate,
          habitDetails.endDate,
          habitDetails.createdByUserId,
        ]
      );
      if (resultId.rowCount === 1) {
        const habitId = parseInt(resultId.rows[0].id);
        await clientDb.query(
          `INSERT INTO habits_metadata (habit_id,
              total_joined) VALUES ($1::integer, $2::integer);`,
          [habitId, 0]
        );
        if (habitDetails.checkPoints.length > 0) {
          const insertList = [];
          for (let j = 0; j < habitDetails.checkPoints.length; j++) {
            insertList.push([
              habitId,
              habitDetails.checkPoints[j].checkPointName,
              habitDetails.checkPoints[j].deadLine,
            ]);
          }
          const result1 = await clientDb.query(
            format(
              `INSERT INTO habits_checkpoints (habit_id,
              checkpoint_name, deadline) VALUES %L RETURNING id;`,
              insertList
            )
          );
          if (result1.rowCount !== habitDetails.checkPoints.length) {
            throw Error("Error inserting records");
          }
        }
      } else {
        throw Error("Error inserting records");
      }
      await clientDb.query("COMMIT");
      res.status(200).send({ message: "success", error: null });
    } catch (error) {
      await clientDb.query("ROLLBACK");
      console.log(error);
      res.status(500).send({ message: "failure", error: error });
    }
  });
  app.post("/db/v1/habits/join", async (req, res) => {
    try {
      await clientDb.query("BEGIN");
      await clientDb.query("SET TIME ZONE 'Asia/Kolkata';");
      const joinDeatils = req.body;
      console.log(chalk.red(`HIT /db/v1/habits/join`));
      const result = await clientDb.query(
        `INSERT INTO user_joined_habits (habit_id, user_id) 
        VALUES ($1::integer, $2::integer) 
        RETURNING id;`,
        [joinDeatils.habitId, joinDeatils.userId]
      );
      if (result.rowCount !== 1) {
        throw Error("Could not join");
      }
      const result1 = await clientDb.query(
        `UPDATE habits_metadata SET
        total_joined  = total_joined  + 1 
        WHERE habit_id = $1::integer RETURNING id;`,
        [joinDeatils.habitId]
      );
      if (result1.rowCount !== 1) {
        throw Error("Could not update total_joined");
      }
      await clientDb.query("COMMIT");
      res.status(200).send({
        rowCount: result.rowCount,
        rows: result.rows,
        message: "success",
        error: null,
      });
    } catch (error) {
      await clientDb.query("ROLLBACK");
      console.log(error);
      res.status(500).send({
        message: "failure",
        error: error,
      });
    }
  });
  app.get("/db/v1/habits/join/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log(chalk.red("HIT /db/v1/habits/join/:userId"));
      const result = await clientDb.query(
        `SELECT uj.id, uj.habit_id, uj.user_id, uj.join_at, 
        h.habit_name, h.created_at FROM user_joined_habits AS uj LEFT 
        JOIN habits AS h ON uj.habit_id = h.id WHERE uj.user_id = $1::integer;`,
        [userId]
      );
      res.status(200).send({ rowCount: result.rowCount, rows: result.rows });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
  app.post("/db/v1/habits/savepoints/create/main", async (req, res) => {
    try {
      await clientDb.query("BEGIN");
      await clientDb.query("SET TIME ZONE 'Asia/Kolkata';");
      console.log(chalk.red(`HIT /db/v1/habits/savepoints/create/all`));
      const joinDeatils = req.body;
      const testing = Boolean(req.query.testing);
      let result;
      if (testing) {
        result = await clientDb.query(
          `INSERT INTO user_joined_habits_main_savepoints
          (joined_habit_id, main_checkpoint_id, message, finished_worked_at) 
          VALUES ($1::integer, $2::integer, $3::text, $4::timestamp) 
          RETURNING id;`,
          [
            joinDeatils.joinHabitId,
            joinDeatils.mainCheckpointId,
            joinDeatils.message,
            joinDeatils.finishedWorkedAt,
          ]
        );
      } else {
        result = await clientDb.query(
          `INSERT INTO user_joined_habits_main_savepoints
          (joined_habit_id, main_checkpoint_id, message) 
          VALUES ($1::integer, $2::integer, $3::text) 
          RETURNING id;`,
          [
            joinDeatils.joinHabitId,
            joinDeatils.mainCheckpointId,
            joinDeatils.message,
          ]
        );
      }
      if (result.rowCount !== 1) {
        throw Error("Could not create main checkpoint");
      }
      await clientDb.query("COMMIT");
      res.status(200).send({
        rowCount: result.rowCount,
        rows: result.rows,
        message: "success",
        error: null,
      });
    } catch (error) {
      await clientDb.query("ROLLBACK");
      console.log(error);
      res.status(500).send({
        message: "failure",
        error: error,
      });
    }
  });
  app.post("/db/v1/habits/savepoints/create/own", async (req, res) => {
    try {
      await clientDb.query("BEGIN");
      await clientDb.query("SET TIME ZONE 'Asia/Kolkata';");
      console.log(chalk.red(`HIT /db/v1/habits/savepoints/create/own`));
      const joinDeatils = req.body;
      const testing = Boolean(req.query.testing);
      console.log(testing);
      let result;
      if (testing) {
        result = await clientDb.query(
          `INSERT INTO user_joined_habits_own_savepoints
          (joined_habit_id, message, finished_worked_at) 
          VALUES ($1::integer, $2::text, $3::timestamp) 
          RETURNING id;`,
          [
            joinDeatils.joinHabitId,
            joinDeatils.message,
            joinDeatils.finishedWorkedAt,
          ]
        );
      } else {
        result = await clientDb.query(
          `INSERT INTO user_joined_habits_own_savepoints
          (joined_habit_id, message) 
          VALUES ($1::integer, $2::text) 
          RETURNING id;`,
          [joinDeatils.joinHabitId, joinDeatils.message]
        );
      }
      if (result.rowCount !== 1) {
        throw Error("Could not create own checkpoint");
      }
      await clientDb.query("COMMIT");
      res.status(200).send({
        rowCount: result.rowCount,
        rows: result.rows,
        message: "success",
        error: null,
      });
    } catch (error) {
      await clientDb.query("ROLLBACK");
      console.log(error);
      res.status(500).send({
        message: "failure",
        error: error,
      });
    }
  });
  app.get("/db/v1/users/details/:emailId", async (req, res) => {
    try {
      const emailId = req.params.emailId;
      console.log(
        chalk.red(`HIT /db/v1/users/details/:emailId, emailId : ${emailId}`)
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
  app.post("/db/v1/users/create", async (req, res) => {
    try {
      await clientDb.query("BEGIN");
      await clientDb.query("SET TIME ZONE 'Asia/Kolkata';");
      const userDeatils = req.body;
      console.log(chalk.red(`HIT /db/v1/users/create`));
      const result = await clientDb.query(
        `INSERT INTO users (email_id, user_name, 
        user_img) VALUES ($1::varchar, $2::varchar, $3::varchar) 
        RETURNING id;`,
        [userDeatils.emailId, userDeatils.userName, userDeatils.userImg]
      );
      if (result.rowCount !== 1) {
        throw Error("user already exist");
      }
      await clientDb.query("COMMIT");
      res.status(200).send({
        rowCount: result.rowCount,
        rows: result.rows,
        message: "success",
        error: null,
      });
    } catch (error) {
      await clientDb.query("ROLLBACK");
      console.log(error);
      res.status(500).send({
        message: "failure",
        error: error,
      });
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
