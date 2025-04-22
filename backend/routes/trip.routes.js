import express from "express";
import verifyToken from "../verifyToken.js";
import {
  getMyTrips,
  getEmployerEmployeeCredits,
  logTrip
} from "../controllers/trip.controller.js";

const router = express.Router();

router.get("/my-trips", verifyToken, getMyTrips);
router.get("/employer/credits", verifyToken, getEmployerEmployeeCredits);
router.post("/log-trip", verifyToken, logTrip);
router.get('/total-summary', verifyUser, getTotalSummary);

export default router;
