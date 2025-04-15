import mongoose from "mongoose";
import "dotenv/config";
const uri = process.env.uri;

const run = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connection Successful");
  } catch (e) {
    console.log("MongoDB Connection Failed");
  }
};

export default run;
