import express from "express";
const app = express();
import run from "./mongoCommands.js";
import {
  verifyUser,
  verifyLogin,
  verifyEmployer,
  verifyBank,
} from "./verifyUser.js";
import account from "./model/account.model.js";
import pending_account from "./model/pending_account.model.js";
import carbon_credit from "./model/carbon_credit.model.js";
import sell_order from "./model/sell_order.model.js";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import session from "express-session";
import buy_order from "./model/buy_order.model.js";

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

// Login request will fail if credentials given do not exist in db.
app.post("/login", verifyLogin, async (req, res) => {
  try {
    const record = await account.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (record) {
      const id = record._id;
      // console.log(`User id: ${id}`);
      req.session.authenticated = true;
      req.session.user = { user_id: id };

      // Appends cookie to user record in DB
      await account.findOneAndUpdate(
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
    const account_record = await account.findOne({
      email: req.body.email,
    });

    if (account_record) {
      return res
        .status(500)
        .json({ message: "Email already exists in database" });
    } else {
      const user_account = await account.create(req.body);
      console.log(user_account);
      res.status(200).json(user_account);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Creates an employer account pending approval from the carbon credit bank
app.post("/createEmployerAccount", async (req, res) => {
  try {
    const account_record = await account.findOne({
      email: req.body.email,
    });

    if (account_record) {
      return res
        .status(500)
        .json({ message: "Email already exists in database" });
    } else {
      req.body.user_type = "employer";
      const pending_user_account = await pending_account.create(req.body);
      res.status(200).json(pending_user_account);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/pendingAccounts", verifyBank, async (req, res) => {
  try {
  } catch (error) {}
});

// Gets the user's carbon credit data
app.get("/dashboard", verifyUser, async (req, res) => {
  try {
    req.user_account.carbon_credits;
    const role = req.user_account.user_type;

    if (role == "employee") {
      const carbon_credit_records = await carbon_credit
        .find()
        .where("_id")
        .in(req.user_account.carbon_credits);

      console.log(`Carbon credit records: ${carbon_credit_records}`);

      res.status(200).json({ msg: carbon_credit_records });
    } else if (role == "employer") {
      // Search through all carbon credit records for all employees linked to employer
    } else if (role == "bank") {
      // Search through net carbon credits for every employer in db.
    }
  } catch (error) {
    res.status(402).json({ message: "User not verified" });
    res.redirect("/login");
  }
});

//TODO: Calculate carbon credits from inputted values
// Submits the user's carbon credits to the DB and links to the employer
app.post("/ccsubmit", verifyUser, async (req, res) => {
  try {
    req.body.amount = 5;

    const carbon_credit_record = await carbon_credit.create(req.body);

    await account.findOneAndUpdate(
      {
        _id: req.user_account._id,
      },
      {
        carbon_credits: [
          ...req.user_account.carbon_credits,
          carbon_credit_record._id,
        ],
      }
    );
    res.status(200).json({ msg: "Success" });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(401).json({ msg: error });
  }
});

// Gets the user's account information
app.get("/account", verifyUser, async (req, res) => {
  try {
    res.status(200).json({
      first_name: req.user_account.first_name,
      last_name: req.user_account.last_name,
      email: req.user_account.email,
      user_type: req.user_account.user_type,
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(401).json({ msg: error });
  }
});

// Updates the user's account information
app.put("/updateAccount", verifyUser, async (req, res) => {
  try {
    if (req.body.first_name) req.user_account.first_name = req.body.first_name;
    if (req.body.last_name) req.user_account.last_name = req.body.last_name;
    if (req.body.email) req.user_account.email = req.body.email;

    const record = await account.findOneAndUpdate(
      {
        _id: req.user_account._id,
      },
      {
        first_name: req.user_account.first_name,
        last_name: req.user_account.last_name,
        email: req.user_account.email,
      }
    );
    console.log(`Updated record: ${record}`);
    res.status(200).json({ msg: "Successful Update" });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(401).json({ msg: error });
  }
});

// Logs the user out of the application
app.post("/logout", verifyUser, async (req, res) => {
  try {
    // Delete cookie from user in DB
    await account.findOneAndUpdate(
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

// If the user is an employer creates a buy order and links to employer's record in DB
app.post("/trades/buy", verifyEmployer, async (req, res) => {
  try {
    console.log(JSON.stringify(req.body));
    let b_order = {
      cc_amount: req.body.cc_amount,
      cc_price: req.body.cc_price,
      employer_id: req.user_account._id,
    };

    b_order = await buy_order.create(b_order);
    await account.findOneAndUpdate(
      {
        _id: req.user_account._id,
      },
      { buy_orders: [...req.user_account.buy_orders, b_order._id] }
    );

    console.log(`Buy order created: ${b_order}`);

    res.status(200).json({ msg: "Succesfully posted buy order" });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(401).json({ msg: error });
  }
});

// If the user is an employer creates a sell request and links to employer's record in DB.
app.post("/trades/sell", verifyEmployer, async (req, res) => {
  try {
    console.log(JSON.stringify(req.body));
    let s_order = {
      cc_amount: req.body.cc_amount,
      cc_price: req.body.cc_price,
      employer_id: req.user_account._id,
    };

    s_order = await sell_order.create(s_order);
    await account.findOneAndUpdate(
      {
        _id: req.user_account._id,
      },
      { buy_orders: [...req.user_account.sell_orders, s_order._id] }
    );

    console.log(`Sell order created: ${s_order}`);

    res.status(200).json({ msg: "Succesfully posted sell order" });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(401).json({ msg: error });
  }
});
