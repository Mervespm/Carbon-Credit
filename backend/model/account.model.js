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
      required: [false],
    },
    cookie: {
      type: String,
      required: [false],
    },
    carbon_credits: {
      type: [mongoose.SchemaTypes.ObjectId],
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);
export default Account;
