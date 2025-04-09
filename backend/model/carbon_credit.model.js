import mongoose from "mongoose";

const carbon_credit_schema = mongoose.Schema(
  {
    transportation_type: {
      type: Number,
      required: [true, "Enter a number corresponding to carbon credit type"],
    },
    distance: {
      type: Number,
      required: [
        true,
        "Enter a distance corresponsing to carbon credit record",
      ],
    },
    amount: {
      type: Number,
      required: [
        true,
        "Enter the amount of carbon credits gained in this trip",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const carbon_credit = mongoose.model("Carbon Credits", carbon_credit_schema);
export default carbon_credit;
