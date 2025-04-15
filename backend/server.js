import express from "express";
import run from "./mongoCommands.js";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import employerRoutes from "./routes/employer.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import cors from 'cors';

const app = express();

app.use(cors());

run().catch(console.dir);

app.use(express.json());


app.use("/api", authRoutes);
app.use("/api", employerRoutes);
app.use("/api", tripRoutes);
app.get("/", (req, res) => {
  res.json("Get request test successful");
});

// Server
app.listen(8080, () => {
  console.log("Server started on port 8080");
});
