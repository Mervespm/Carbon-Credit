import mongoose from "mongoose";

const sell_order_schema = mongoose.Schema(
  {
    employer_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, "A sell order requires an employer to post it"],
    },
    cc_amount: {
      type: Number,
      required: [
        true,
        "The amount of carbon credits being put for sale must be specified",
      ],
    },
    cc_price: {
      type: Number,
      required: [true, "The cost per carbon credit in USD must be specified."],
    },
  },
  {
    timestamps: true,
  }
);

const sell_order = mongoose.model("Sell Orders", sell_order_schema);
export default sell_order;
