import express from "express";
import { sellCredits } from "../controllers/transaction.controller.js";
import { verifyUser } from "../verifyUser.js";

const router = express.Router();

router.post("/sell", verifyUser, sellCredits);

export default router;
