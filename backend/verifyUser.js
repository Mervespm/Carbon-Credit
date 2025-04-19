// Used for reference https://www.youtube.com/watch?v=mbsmsi7l3r4
// Used for reference https://www.youtube.com/watch?v=oYGhoHW7zqI
import "dotenv/config";
import mongoose from "mongoose";
import account from "./model/account.model.js";

// Verifies if cookie exists and is valid
const verifyUser = async (req, res, next) => {
  try {
    const user_account = await account.findOne({
      _id: new mongoose.Types.ObjectId(req.session.user.user_id),
    });
    req.user_account = user_account;

    // User must have a cookie linked to their account to view dashboard data
    if (user_account.cookie == req.session.id) {
      console.log(`User's cookie is valid`);
      return next();
    }
    return res.redirect("/login");
  } catch (error) {
    console.log(`Verify user error: ${error}`);
    return res.status(401).redirect("/login");
  }
};

// Verifies whether the user is logged in and is an employer
const verifyEmployer = async (req, res, next) => {
  try {
    const user_account = await account.findOne({
      _id: new mongoose.Types.ObjectId(req.session.user.user_id),
    });
    req.user_account = user_account;

    // User must have a cookie linked to their account to view dashboard data
    if (user_account.cookie == req.session.id) {
      console.log(`User's cookie is valid`);
    }
  } catch (error) {
    console.log(`User is not logged in: ${error}`);
    return res.redirect("/login");
  }
  try {
    if (req.user_account.user_type == "employer") {
      console.log(`User account has a cookie and is an employer`);
      return next();
    }
    res.status(401).json({ msg: "Invalid permissions" });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(`User does not have valid permissions: ${error}`);
    return res.status(401).redirect("/login");
  }
};

const verifyBank = async (req, res, next) => {
  try {
    const user_account = await account.findOne({
      _id: new mongoose.Types.ObjectId(req.session.user.user_id),
    });
    req.user_account = user_account;

    // User must have a cookie linked to their account to view dashboard data
    if (user_account.cookie == req.session.id) {
      console.log(`User's cookie is valid`);
    }
  } catch (error) {
    console.log(`User is not logged in: ${error}`);
    return res.redirect("/login");
  }
  try {
    if (req.user_account.user_type == "bank") {
      console.log(`User account has a cookie and is an bank employee`);
      return next();
    }
    res.status(401).json({ msg: "Invalid permissions" });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(`User does not have valid permissions: ${error}`);
    return res.status(401).redirect("/login");
  }
};

// If user is already logged in redirect them from the login page
const verifyLogin = async (req, res, next) => {
  console.log(`Verify login`);
  try {
    const user_account = await account.findOne({
      _id: new mongoose.Types.ObjectId(req.session.user.user_id),
    });
    req.user_account = user_account;

    if (req.session && req.user_account) {
      if (user_account.cookie == req.session.id) {
        console.log(`User is already signed in`);
        return res.redirect("/dashboard");
      }
    }
    return next();
  } catch (error) {
    console.log(`Login verify error: ${error}`);
    return next();
  }
};

export { verifyUser, verifyLogin, verifyEmployer, verifyBank };
