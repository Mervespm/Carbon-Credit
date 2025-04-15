import mongoose from "mongoose";
const password = "IdejITccueCJsKnj";
const uri = `mongodb://mrvkrblt14:IdejITccueCJsKnj@ac-hufbj9t-shard-00-00.z9xdten.mongodb.net:27017,ac-hufbj9t-shard-00-01.z9xdten.mongodb.net:27017,ac-hufbj9t-shard-00-02.z9xdten.mongodb.net:27017/?replicaSet=atlas-kmco8a-shard-0&ssl=true&authSource=admin`;

const run = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: "test", 
    });
    console.log("MongoDB Connection Successful");
  } catch (e) {
    console.error("MongoDB Connection Failed", e);
  }
};

export default run;
