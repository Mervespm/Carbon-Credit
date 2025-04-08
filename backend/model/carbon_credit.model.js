import mongoose from "mongoose";

const carbon_credit_schema = mongoose.Schema(
  {
    transportation_type: {
      type: number,
      required: [true, "Enter a number corresponding to carbon credit type"],
    },
    distance: {
      type: number,
      required: [
        true,
        "Enter a distance corresponsing to carbon credit record",
      ],
    },
    amount: {
      type: number,
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

const carbon_credit = mongoose.model(
  "Carbon Credits",
  carbon_credit_schemaSchema
);
export default carbon_credit;
