// Used for reference https://www.youtube.com/watch?v=mbsmsi7l3r4
// Used for reference https://www.youtube.com/watch?v=oYGhoHW7zqI
import "dotenv/config";
import mongoose from "mongoose";
import Account from "./model/account.model.js";

// Verifies if cookie exists and is valid
const verifyUser = async (req, res, next) => {
  try {
    const user_account = await Account.findOne({
      _id: new mongoose.Types.ObjectId(req.session.user.user_id),
    });
    req.user_account = user_account;

    // User must have a cookie linked to their account to view dashboard data
    if (user_account.cookie == req.session.id) {
      console.log(`User's cookie is valid`);
      return next();
    }
    return res.redirect("/login");
  } catch (e) {
    console.log(`Verify user error: ${e}`);
    return res.status(401).redirect("/login");
  }
};

// If user is already logged in redirect them from the login page
const verifyLogin = async (req, res, next) => {
  console.log(`Verify login`);
  try {
    const user_account = await Account.findOne({
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

export { verifyUser, verifyLogin };
