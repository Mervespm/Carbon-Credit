import express from "express";
const app = express();
import run from "./mongoCommands.js";
import verifyUser from "./verifyUser.js";
import Account from "./model/account.model.js";
import carbon_credit from "./model/carbon_credit.model.js";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import session from "express-session";

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

// TODO: Make session cookies secure
app.use(
  session({
    secret: process.env.ACCESS_TOKEN_HASH,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 30000 },
  })
);
app.use(express.json());
app.use(cors());

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
app.get("/", (req, res) => {
  res.json("Get request test successful");
});

// Login request will fail if credentials given do not exist in db.
app.post("/login", async (req, res) => {
  try {
    const record = await Account.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (record) {
      const id = record._id;
      // console.log(`User id: ${id}`);
      req.session.authenticated = true;
      req.session.user = { user_id: id };

      // Appends cookie to user record in DB
      await Account.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { cookie: req.session.id }
      );

      res.status(200).json({ msg: "Successful Login" });
    } else {
      res.status(401).json({ message: "Invalid login credentials" });
    }
  } catch (error) {
    // console.log(`Error: ${error}`);
    res.status(500).json(error);
  }
});

// Create account request will fail if email already exists in db.
app.post("/createAccount", async (req, res) => {
  try {
    const account_record = await Account.findOne({
      email: req.body.email,
    });

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

// Verifies if the user is logged in with JWT and then searches for their record in the DB.
app.get("/dashboard", verifyUser, async (req, res) => {
  try {
    //TODO: Retrieve user's carbon credit data from database

    res.status(200).json({ msg: "Success" });
  } catch (error) {
    res.status(402).json({ message: "User not verified" });
    res.redirect("/login");
  }
});

app.post("/logout", verifyUser, async (req, res) => {
  try {
    // Delete cookie from user in DB
    await Account.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.session.user.user_id),
      },
      { cookie: null }
    );
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
});
