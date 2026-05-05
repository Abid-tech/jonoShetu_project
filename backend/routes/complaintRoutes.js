const express = require("express");
const router = express.Router();

const { 
  createComplaint, 
  getAllComplaints, 
  getComplaintById,
  getComplaintsByPriority,    // NEW
  getComplaintStats,          // NEW
  updateComplaintStatus,       // NEW
  assignPersonnel,      // NEW
  unassignPersonnel     // NEW
} = require("../controller/complaintController");

router.post("/", createComplaint);
router.get("/", getAllComplaints);
router.get("/by-priority", getComplaintsByPriority);    // NEW: GET /complaints/by-priority
router.get("/stats", getComplaintStats);                // NEW: GET /complaints/stats
router.get("/:id", getComplaintById);
router.patch("/:id/status", updateComplaintStatus);     // NEW: PATCH /complaints/:id/status
router.patch("/:id/assign", assignPersonnel);      // NEW route
router.patch("/:id/unassign", unassignPersonnel); 
module.exports = router;



