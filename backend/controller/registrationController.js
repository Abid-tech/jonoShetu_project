const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    // Destructure all fields from req.body
    const {
      nidNumber,
      fullName,
      dateOfBirth,
      fatherName,
      motherName,
      address,
      bloodGroup,
      phone,
      role,
      password,
    } = req.body;

    // Validate required fields
    if (!nidNumber?.trim()) {
      return res.status(400).json({
        success: false,
        message: "এনআইডি নম্বর দেওয়া আবশ্যক।",
        error: "MISSING_NID",
      });
    }

    if (!fullName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "পূর্ণ নাম দেওয়া আবশ্যক।",
        error: "MISSING_NAME",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "মোবাইল নম্বর দেওয়া আবশ্যক।",
        error: "MISSING_PHONE",
      });
    }

    // Bangladeshi phone validation
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

    // Duplicate checks
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

    // Save to MongoDB (without image URLs)
    const user = await User.create({
      nidNumber:     nidNumber.trim(),
      fullName:      fullName?.trim()    || "",
      dateOfBirth:   dateOfBirth?.trim() || "",
      fatherName:    fatherName?.trim()  || "",
      motherName:    motherName?.trim()  || "",
      address:       address?.trim()     || "",
      bloodGroup:    bloodGroup?.trim()  || "",
      phone:         phone.trim(),
      role:          role === "authority" ? "authority" : "citizen",
      password:      password,
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
        role:        user.role,
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

const checkNID = async (req, res) => {
  try {
    const exists = await User.findOne({ nidNumber: req.params.nidNumber.trim() });
    return res.status(200).json({ exists: !!exists });
  } catch {
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
};

module.exports = { registerUser, checkNID };