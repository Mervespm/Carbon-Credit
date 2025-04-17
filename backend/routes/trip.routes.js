import express from "express";
import { verifyUser } from "../verifyUser.js";
import {
  getMyTrips,
  getEmployerEmployeeCredits,
  logTrip
} from "../controllers/trip.controller.js";

const router = express.Router();

// Get their own trips
router.get("/my-trips", verifyUser, getMyTrips);

// See employee credit stats
router.get("/employer/credits", verifyUser, getEmployerEmployeeCredits);

// Log a new trip
router.post("/log-trip", verifyUser, logTrip);

export default router;
