const express = require("express");
const router  = express.Router();
const { loginUser, verifyOtp, resendOtp } = require("../controller/loginController");

// POST /login          → verify NID+password, send OTP
router.post("/",            loginUser);

// POST /login/verify-otp  → verify OTP, complete login
router.post("/verify-otp",  verifyOtp);

// POST /login/resend-otp  → resend OTP to same phone
router.post("/resend-otp",  resendOtp);

module.exports = router;
