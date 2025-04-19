import mongoose from "mongoose";

const buy_order_schema = mongoose.Schema(
  {
    employer_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, "A sell order requires an employer to post it"],
    },
    cc_amount: {
      type: Number,
      required: [
        true,
        "The amount of carbon credits being purchased must be specified",
      ],
    },
    cc_price: {
      type: Number,
      required: [
        true,
        "The price per carbon credit being paid in USD must be specified.",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const buy_order = mongoose.model("Buy Orders", buy_order_schema);
export default buy_order;
