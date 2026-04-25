const Complaint = require("../models/Complaint");

// Feature 1: Monthly complaint counts
// GET /analytics/monthly-comparison
exports.getMonthlyComparison = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year:  { $year:  "$createdAt" },
          },
          totalComplaints: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Feature 2: Area-wise monthly complaints (grouped by district + month + year)
// GET /analytics/area-monthly
exports.getAreaMonthly = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: {
            district: "$district",
            month: { $month: "$createdAt" },
            year:  { $year:  "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "count": -1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};