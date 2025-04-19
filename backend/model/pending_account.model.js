import mongoose from "mongoose";

const pending_account_schema = mongoose.Schema(
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
      required: [false],
    },
    company_id: {
      type: String,
      required: function () {
        this.user_type == "employee";
      },
    },
    cookie: {
      type: String,
      required: [false],
    },
  },
  {
    timestamps: true,
  }
);

const pending_account = mongoose.model(
  "Pending Accounts",
  pending_account_schema
);
export default pending_account;
