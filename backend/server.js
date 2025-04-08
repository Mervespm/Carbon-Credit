import express from "express";
const app = express();
import run from "./mongoCommands.js";

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

app.get("/api", (req, res) => {
  res.json("Get request test successful");
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
