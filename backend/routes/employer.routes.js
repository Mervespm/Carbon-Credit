import express from "express";
import { getPendingEmployers, approveEmployer } from "../controllers/employer.controller.js";
import { verifyToken } from "../jwt.js";
const router = express.Router();

router.get("/employers/pending", verifyToken, getPendingEmployers);
router.patch("/employers/approve/:id", approveEmployer);

export default router;
