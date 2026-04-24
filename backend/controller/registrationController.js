const User = require("../models/User");

// ── POST /register ────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    // 1. Check images
    if (!req.files?.frontImage || !req.files?.backImage) {
      return res.status(400).json({
        success: false,
        message: "উভয় ছবি আপলোড করা আবশ্যক।",
        error: "MISSING_IMAGES",
      });
    }

    // 2. Destructure all fields from req.body
    const {
      nidNumber,
      fullName,
      dateOfBirth,
      fatherName,
      motherName,
      address,
      bloodGroup,
      phone,
      password,
    } = req.body;

    // 3. Validate required fields
    if (!nidNumber?.trim()) {
      return res.status(400).json({
        success: false,
        message: "এনআইডি নম্বর দেওয়া আবশ্যক।",
        error: "MISSING_NID",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "মোবাইল নম্বর দেওয়া আবশ্যক।",
        error: "MISSING_PHONE",
      });
    }

    // Bangladeshi phone: must start with 01 and be 11 digits
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)।",
        error: "INVALID_PHONE",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
        error: "WEAK_PASSWORD",
      });
    }

    // 4. Duplicate checks
    const existingNID = await User.findOne({ nidNumber: nidNumber.trim() });
    if (existingNID) {
      return res.status(409).json({
        success: false,
        message: "এই এনআইডি নম্বর দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে।",
        error: "ALREADY_REGISTERED",
      });
    }

    const existingPhone = await User.findOne({ phone: phone.trim() });
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে।",
        error: "PHONE_TAKEN",
      });
    }

    // 5. Save to MongoDB (password auto-hashed via pre-save hook)
    const user = await User.create({
      nidNumber:     nidNumber.trim(),
      fullName:      fullName?.trim()    || "",
      dateOfBirth:   dateOfBirth?.trim() || "",
      fatherName:    fatherName?.trim()  || "",
      motherName:    motherName?.trim()  || "",
      address:       address?.trim()     || "",
      bloodGroup:    bloodGroup?.trim()  || "",
      phone:         phone.trim(),
      password:      password,
      frontImageUrl: `/uploads/${req.files.frontImage[0].filename}`,
      backImageUrl:  `/uploads/${req.files.backImage[0].filename}`,
    });

    return res.status(201).json({
      success: true,
      message: "রেজিস্ট্রেশন সফল হয়েছে!",
      data: {
        id:          user._id,
        nidNumber:   user.nidNumber,
        fullName:    user.fullName,
        dateOfBirth: user.dateOfBirth,
        fatherName:  user.fatherName,
        motherName:  user.motherName,
        address:     user.address,
        bloodGroup:  user.bloodGroup,
        phone:       user.phone,
        createdAt:   user.createdAt,
      },
    });

  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      success: false,
      message: "সার্ভারে সমস্যা হয়েছে।",
      error: "SERVER_ERROR",
    });
  }
};

// ── GET /register/check/:nidNumber ────────────────────────
const checkNID = async (req, res) => {
  try {
    const exists = await User.findOne({ nidNumber: req.params.nidNumber.trim() });
    return res.status(200).json({ exists: !!exists });
  } catch {
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

module.exports = { registerUser, checkNID };
