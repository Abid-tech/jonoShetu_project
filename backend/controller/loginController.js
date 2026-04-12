const User  = require("../models/User");
const crypto = require("crypto");

// In-memory OTP store: { phone: { otp, expiresAt, userId } }
// For production, replace with Redis
const otpStore = new Map();

// ── Helper: send SMS via BulkSMSBD (free Bangladeshi API) ─
const sendSMS = async (phone, message) => {
  const apiKey   = process.env.BULKSMS_API_KEY;   // your BulkSMSBD API key
  const senderId = process.env.BULKSMS_SENDER_ID || "8809617612345"; // your approved sender ID

  const url = `http://bulksmsbd.net/api/smsapi` +
    `?api_key=${apiKey}` +
    `&type=text` +
    `&number=${phone}` +
    `&senderid=${senderId}` +
    `&message=${encodeURIComponent(message)}`;

  const res  = await fetch(url);
  const text = await res.text();
  console.log("BulkSMSBD response:", text);

  // BulkSMSBD returns "1000" or "1001" etc. — 1000 means success
  if (!text.includes("1000")) {
    throw new Error(`SMS failed: ${text}`);
  }
};

// ── POST /login ───────────────────────────────────────────
// Step 1: verify NID + password → send OTP
const loginUser = async (req, res) => {
  try {
    const { nidNumber, password } = req.body;

    if (!nidNumber?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "এনআইডি এবং পাসওয়ার্ড দেওয়া আবশ্যক।",
        error: "MISSING_FIELDS",
      });
    }

    // Find user
    const user = await User.findOne({ nidNumber: nidNumber.trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "এনআইডি বা পাসওয়ার্ড সঠিক নয়।",
        error: "INVALID_CREDENTIALS",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "এনআইডি বা পাসওয়ার্ড সঠিক নয়।",
        error: "INVALID_CREDENTIALS",
      });
    }

    // Generate 6-digit OTP
    const otp       = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore.set(user.phone, { otp, expiresAt, userId: user._id.toString() });

    // Send SMS
    const message = `জনসেতু লগইন কোড: ${otp}\nএই কোডটি ৫ মিনিটের জন্য বৈধ। কাউকে শেয়ার করবেন না।`;
    await sendSMS(user.phone, message);

    console.log(`OTP sent to ${user.phone}: ${otp}`); // remove in production

    return res.status(200).json({
      success: true,
      message: "OTP পাঠানো হয়েছে।",
      phone: user.phone.replace(/(\d{3})\d{5}(\d{3})/, "$1*****$2"), // mask: 017*****890
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "সার্ভারে সমস্যা হয়েছে।",
      error: "SERVER_ERROR",
    });
  }
};

// ── POST /login/verify-otp ────────────────────────────────
// Step 2: verify OTP → return user data (or JWT if you use it)
const verifyOtp = async (req, res) => {
  try {
    const { nidNumber, otp } = req.body;

    if (!nidNumber?.trim() || !otp?.trim()) {
      return res.status(400).json({
        success: false,
        message: "এনআইডি এবং OTP দেওয়া আবশ্যক।",
        error: "MISSING_FIELDS",
      });
    }

    // Look up user to get their phone, then look up OTP store
    const user = await User.findOne({ nidNumber: nidNumber.trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: "ব্যবহারকারী পাওয়া যায়নি।", error: "USER_NOT_FOUND" });
    }
    const phone = user.phone;

    const record = otpStore.get(phone);

    // OTP not found
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP পাওয়া যায়নি। আবার লগইন করুন।",
        error: "OTP_NOT_FOUND",
      });
    }

    // OTP expired
    if (Date.now() > record.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: "OTP মেয়াদ শেষ হয়ে গেছে। আবার লগইন করুন।",
        error: "OTP_EXPIRED",
      });
    }

    // OTP mismatch
    if (record.otp !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: "OTP সঠিক নয়।",
        error: "INVALID_OTP",
      });
    }

    // OTP matched — clean up and return user
    otpStore.delete(phone);

    // ── If you use JWT, generate token here: ──────────────
    // const jwt = require("jsonwebtoken");
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({
      success: true,
      message: "লগইন সফল হয়েছে!",
      data: {
        id:        user._id,
        nidNumber: user.nidNumber,
        fullName:  user.fullName,
        phone:     user.phone,
      },
    });

  } catch (err) {
    console.error("OTP verify error:", err);
    return res.status(500).json({
      success: false,
      message: "সার্ভারে সমস্যা হয়েছে।",
      error: "SERVER_ERROR",
    });
  }
};

// ── POST /login/resend-otp ────────────────────────────────
const resendOtp = async (req, res) => {
  try {
    const { nidNumber } = req.body;
    if (!nidNumber?.trim()) {
      return res.status(400).json({ success: false, message: "এনআইডি নম্বর দিন।" });
    }

    const user = await User.findOne({ nidNumber: nidNumber.trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: "ব্যবহারকারী পাওয়া যায়নি।" });
    }
    const phone = user.phone;

    const existing = otpStore.get(phone);

    // Rate limit: don't allow resend if last OTP was sent < 60s ago
    if (existing && (existing.expiresAt - Date.now()) > 4 * 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "অনুগ্রহ করে ১ মিনিট পর আবার চেষ্টা করুন।",
        error: "TOO_SOON",
      });
    }

    const otp       = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(phone, { otp, expiresAt, userId: user._id.toString() });

    const message = `জনসেতু লগইন কোড: ${otp}\nএই কোডটি ৫ মিনিটের জন্য বৈধ। কাউকে শেয়ার করবেন না।`;
    await sendSMS(phone, message);

    console.log(`OTP resent to ${phone}: ${otp}`);

    return res.status(200).json({ success: true, message: "নতুন OTP পাঠানো হয়েছে।" });

  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ success: false, message: "সার্ভারে সমস্যা হয়েছে।" });
  }
};

module.exports = { loginUser, verifyOtp, resendOtp };
