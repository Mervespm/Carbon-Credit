import express from "express";
import {
  getEmployees,
  approveEmployee,
  disapproveEmployee,
  getPendingEmployers,
  approveEmployer,
  disapproveEmployer
} from "../controllers/employer.controller.js";
import verifyToken from "../verifyToken.js";


const router = express.Router();

router.get("/pending", verifyToken, getPendingEmployers);
router.patch("/approve/:id", verifyToken, approveEmployer);
router.patch("/disapprove/:id", verifyToken, disapproveEmployer);
router.get("/employees", verifyToken, getEmployees);
router.patch("/employees/approve/:id", verifyToken, approveEmployee);
router.patch("/employees/disapprove/:id", verifyToken, disapproveEmployee);

export default router;
