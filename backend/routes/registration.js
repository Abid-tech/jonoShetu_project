const express    = require("express");
const router     = express.Router();
<<<<<<< HEAD
const path = require("path");
const upload = require(path.join(__dirname, "../middleware/upload"));
=======
const upload     = require("../middleware/upload");
>>>>>>> e317dc5d1e4f0752ec699b1d44d1d835c39860b6
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