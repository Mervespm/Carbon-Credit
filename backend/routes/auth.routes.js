import express from "express";
import {
  register,
  login,
  logout,
  validateCompanyCode,
  getProfile
} from "../controllers/auth.controller.js";
import verifyToken from "../verifyToken.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/validate-company-code", validateCompanyCode);
router.get("/me", verifyToken, getProfile);


export default router;
