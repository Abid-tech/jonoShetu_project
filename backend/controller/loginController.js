const User = require("../models/User");


// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  nidNumber: "11111",
  password: "admin1234",
  adminData: {
    id: "admin_001",
    nidNumber: "11111",
    fullName: "সিস্টেম এডমিনিস্ট্রেটর",
    phone: "01999999999",
    role: "admin",
    isAdmin: true
  }
};


// ── POST /login ───────────────────────────────────────────
// Direct login without OTP
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


    // Check for admin login first
    if (nidNumber === ADMIN_CREDENTIALS.nidNumber && 
        password === ADMIN_CREDENTIALS.password) {
      return res.status(200).json({
        success: true,
        message: "অ্যাডমিন লগইন সফল হয়েছে!",
        data: ADMIN_CREDENTIALS.adminData
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

    // Store user info in session (optional)
    // You can also generate a JWT token here
    
    // Return user data directly without OTP
    return res.status(200).json({
      success: true,
      message: "লগইন সফল হয়েছে!",
      data: {
        id:        user._id,
        nidNumber: user.nidNumber,
        fullName:  user.fullName,
        phone:     user.phone,
        role:      user.role,
      },
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

module.exports = { loginUser };