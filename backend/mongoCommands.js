import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;

const run = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || "test",
    });
    console.log("MongoDB Connection Successful");
  } catch (e) {
    console.error("MongoDB Connection Failed", e);
  }
};

export default run;
