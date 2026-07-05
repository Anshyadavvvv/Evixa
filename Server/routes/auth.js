import express from "express";
import { registeruser , loginuser , verifyotp } from "../controller/authcontroller.js";
const router = express.Router();

router.post("/register", registeruser);
router.post("/login", loginuser);
router.post("/verify-otp", verifyotp);

export default router;



