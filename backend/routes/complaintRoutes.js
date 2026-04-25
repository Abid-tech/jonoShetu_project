const express = require("express");
const router = express.Router();

const { createComplaint, getAllComplaints, getComplaintById } = require("../controller/complaintController");  // ← controller

router.post("/", createComplaint);
router.get("/", getAllComplaints);
router.get("/:id", getComplaintById);

module.exports = router;