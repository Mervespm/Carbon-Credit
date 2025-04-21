import mongoose from "mongoose";
import Account from "./model/account.model.js";

const verifyUser = async (req, res, next) => {
  try {
    console.log(`Session ID: ${req.session.id}`);
    if (!req.session.user || !req.session.user.user_id) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user_account = await Account.findById(req.session.user.user_id);
    if (!user_account) {
      return res.status(401).json({ message: "Invalid session" });
    }

    req.user_account = user_account;
    req.user = {
      id: user_account._id,
      role: user_account.user_type
    }; 
    next();
  } catch (err) {
    console.error("verifyUser error:", err);
    res.status(500).json({ message: "Server error during authentication" });
  }
};

const verifyLogin = async (req, res, next) => {
  try {
    const user = req.session.user;

    if (user && user.user_id) {
      const account = await Account.findById(user.user_id);
      if (account && account.cookie === req.session.id) {
        const role = account.user_type;

        if (role === "employee") return res.redirect("/dashboard/employee");
        if (role === "employer") return res.redirect("/dashboard/employer");
        if (role === "bank") return res.redirect("/dashboard/bank");

        return res.status(403).json({ message: "Unknown role" });
      }
    }
    next();
  } catch (err) {
    console.error("verifyLogin error:", err);
    next();
  }
};


export { verifyUser, verifyLogin };
