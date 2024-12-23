const express = require("express");
const router = express.Router();

const {
  validateAttendanceParams,
  validateAttendanceBody,
} = require("../middlewares/attendanceValidation");
const attendanceController = require("../controllers/attendanceController");

router.get(
  "/:year/:month",
  validateAttendanceParams,
  attendanceController.getAttendanceRecord
);
router.post(
  "/:year/:month",
  validateAttendanceParams,
  validateAttendanceBody,
  attendanceController.createAttendanceRecord
);
router.put(
  "/:year/:month",
  validateAttendanceParams,
  validateAttendanceBody,
  attendanceController.updateAttendanceRecord
);
router.delete(
  "/:year/:month",
  validateAttendanceParams,
  attendanceController.deleteAttendanceRecord
);

// Error handling middleware for this router
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = router;
