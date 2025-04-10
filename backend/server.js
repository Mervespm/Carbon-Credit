import express from "express";
const app = express();
import run from "./mongoCommands.js";
import Account from "./model/account.model.js";
import carbon_credit from "./model/carbon_credit.model.js";
import mongoose from "mongoose";
/* API Requests

Create an account (POST)

Login API request (POST) 

Password reset (POST)
  User inputs an email, email is checked against database, if email exists send a email w/link with flag/cookie to page to reset password. 

Reset password page (POST)
  User inputs new password twice. Password is changed they can login again.

Get dashboard data from database (GET)

Get user's account info (when opening account info page) (GET)

User updates their account info (UPDATE)

User deletes their account (DELETE)

Carbon credit submission type (POST)


*/

run().catch(console.dir);

app.use(express.json());

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
app.get("/", (req, res) => {
  res.json("Get request test successful");
});

// Login request will fail if credentials given do not exist in db.
app.post("/api/login", async (req, res) => {
  try {
    const record = await Account.find({
      email: req.body.email,
      password: req.body.password,
    });
    console.log(record);
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create account request will fail if email already exists in db.
app.post("/api/createAccount", async (req, res) => {
  console.log(req.body);
  try {
    const account_record = await Account.find({ email: req.body.email }).exec();

    if (account_record) {
      res.status(500).json({ message: "Email already exists in database" });
    }

    const account = await Account.create(req.body);

    console.log(account);
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const dashboard_data = await Account.find({ id: req.body.id }).exec();

    res.status(200).json(dashboard_data);
  } catch (e) {
    res.status(500).json({ message: e.message });
    console.log(e.message);
  }
});
