

import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  user_type: String,
  company_name: String,
  company_code: String,
  isApproved: { type: Boolean, default: false },
  homeLocation: {
    lat: Number,
    lng: Number
  },
  officeLocation: {
    lat: Number,
    lng: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Account = mongoose.model("Account", accountSchema);
export default Account;
