const express = require("express");
const router = express.Router();
const { registerUser, checkNID } = require("../controller/registrationController");

// POST /register (no image upload needed)
router.post("/", registerUser);

// GET /register/check/:nidNumber
router.get("/check/:nidNumber", checkNID);

module.exports = router;