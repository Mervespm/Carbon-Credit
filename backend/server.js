import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import cors from "cors";
import run from "./mongoCommands.js";
import authRoutes from "./routes/auth.routes.js";
import employerRoutes from "./routes/employer.routes.js";
import tripRoutes from "./routes/trip.routes.js";

dotenv.config();
const app = express();
run().catch(console.dir);

console.log(`ORIGIN: ${process.env.CLIENT_URL}`)
app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true,
  exposedHeaders: ['set-cookie', 'user_id']
}));
app.use(express.json());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite:'none',       
    secure: true 
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 24 * 60 * 60 
  }),
}));

app.use("/api", authRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/trip", tripRoutes);


app.get("/", (req, res) => {
  res.json("Get request test successful");
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
