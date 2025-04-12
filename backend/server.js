import express from "express";
import jwt from "jsonwebtoken";
const app = express();
import run from "./mongoCommands.js";
import Account from "./model/account.model.js";
import carbon_credit from "./model/carbon_credit.model.js";
import mongoose from "mongoose";
import "dotenv/config";

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

Get impending employer registration data for carbon credit bank dashboard (GET)

Carbon credit bank approves or denies employer registration (POST)

Login method needs to verify whether the user is approved. (POST)

Get the employer unique id to give to employees (GET)

Get employees analytic data (GET)



QOL: 
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
    const record = await Account.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    console.log(record._id.toString());
    const token = jwt.sign(
      record._id.toString(),
      process.env.ACCESS_TOKEN_HASH
    );

    res.status(200).json({ token: token });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create account request will fail if email already exists in db.
app.post("/api/createAccount", async (req, res) => {
  try {
    const account_record = await Account.findOne({
      email: req.body.email,
    }).exec();

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
  if (req.body.user_role == "employee") {
    try {
      const dashboard_data = await Account.find({ id: req.body.id }).exec();

      res.status(200).json(dashboard_data);
    } catch (e) {
      res.status(500).json({ message: e.message });
      console.log(e.message);
    }
  }

  if (req.body.user_role == "employer") {
    try {
      const dashboard_data = await Account.find({ id: req.body.id }).exec();

      res.status(200).json(dashboard_data);
    } catch (e) {
      res.status(500).json({ message: e.message });
      console.log(e.message);
    }
  }
});
