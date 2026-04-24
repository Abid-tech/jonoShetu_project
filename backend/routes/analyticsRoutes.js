const express = require("express");
const router = express.Router();

const {
  getMonthlyComparison,
  getAreaMonthly,
} = require("../controller/analyticsController");

// GET /analytics/monthly-comparison
router.get("/monthly-comparison", getMonthlyComparison);

// GET /analytics/area-monthly
router.get("/area-monthly", getAreaMonthly);

module.exports = router;