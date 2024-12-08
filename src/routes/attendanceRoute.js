const express = require("express");
const router = express.Router();
const logger = require("../configs/logger");
const {
  validateAttendanceParams,
  validateAttendanceBody,
} = require("../middlewares/attendanceValidation");
const attendanceController = require("../controllers/attendanceController");

router.get(
  "/:year/:month",
  validateAttendanceParams,
  attendanceController.getAttendanceData
);
router.post(
  "/:year/:month",
  validateAttendanceParams,
  validateAttendanceBody,
  attendanceController.createAttendanceData
);
router.put(
  "/:year/:month",
  validateAttendanceParams,
  validateAttendanceBody,
  attendanceController.updateAttendanceData
);
router.delete(
  "/:year/:month",
  validateAttendanceParams,
  attendanceController.deleteAttendanceData
);

// Error handling middleware for this router
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = router;
