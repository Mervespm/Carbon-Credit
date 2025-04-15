
import express from "express";
import { validateCompanyCode,register, login, getProfile  } from "../controllers/auth.controller.js";
import { verifyToken } from "../jwt.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post('/validate-company-code', validateCompanyCode);
router.get('/me', verifyToken, getProfile);
export default router;
