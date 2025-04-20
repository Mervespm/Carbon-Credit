<<<<<<< HEAD
import mongoose from "mongoose";

const accountSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Enter a first name"],
    },
    last_name: {
      type: String,
      required: [true, "Enter a last name"],
    },
    email: {
      type: String,
      required: [true, "Enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Enter a password"],
    },
    user_type: {
      type: String,
      required: [false, "All users must have a type"],
      default: "customer",
    },
    carbon_credits: {
      type: mongoose.SchemaTypes.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);
=======


import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },  
  user_type: String,
  company_name: String,
  company_code: String,
  isApproved: { type: Boolean, default: false },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
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

>>>>>>> merv

const Account = mongoose.model("Account", accountSchema);
export default Account;
