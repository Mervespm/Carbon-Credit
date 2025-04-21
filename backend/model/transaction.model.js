// backend/model/transaction.model.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  credits: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
