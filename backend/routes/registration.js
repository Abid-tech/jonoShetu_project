const express    = require("express");
const router     = express.Router();
const upload     = require("../middleware/upload");
const { registerUser, checkNID } = require("../controller/registrationController");

// POST /register
router.post(
  "/",
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage",  maxCount: 1 },
  ]),
  registerUser
);

// GET /register/check/:nidNumber
router.get("/check/:nidNumber", checkNID);

module.exports = router;