import express from "express";
import { verifyUser } from "../verifyUser.js";
import {
  getMyTrips,
  getEmployerEmployeeCredits,
  logTrip
} from "../controllers/trip.controller.js";

const router = express.Router();


router.get("/my-trips", verifyUser, getMyTrips);
router.get("/employer/credits", verifyUser, getEmployerEmployeeCredits);
router.post("/log-trip", verifyUser, logTrip);

export default router;
