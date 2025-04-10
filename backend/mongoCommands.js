import mongoose from "mongoose";
const password = "gLaSHgxapnp1J8iI";
const uri = `mongodb+srv://alonzovelez9:${password}@carbon-credit.pjbiae2.mongodb.net/?appName=Carbon-Credit`;

const run = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connection Successful");
  } catch (e) {
    console.log("MongoDB Connection Failed");
  }
};

export default run;
