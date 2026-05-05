const express = require("express");
const router  = express.Router();
const { loginUser } = require("../controller/loginController");

// POST /login → verify NID+password, return user data
router.post("/", loginUser);

module.exports = router;