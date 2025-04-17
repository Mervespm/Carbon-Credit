import express from "express";
import {
  getEmployees,
  approveEmployee,
  disapproveEmployee,
  getPendingEmployers,
  approveEmployer,
  disapproveEmployer
} from "../controllers/employer.controller.js";
import { verifyUser } from "../verifyUser.js";

const router = express.Router();

//Bank
router.get("/pending", verifyUser, getPendingEmployers);
router.patch("/approve/:id", verifyUser, approveEmployer);
router.patch("/disapprove/:id", verifyUser, disapproveEmployer);

// Employer
router.get("/employees", verifyUser, getEmployees);
router.patch("/employees/approve/:id", verifyUser, approveEmployee);
router.patch("/employees/disapprove/:id", verifyUser, disapproveEmployee);

export default router;
