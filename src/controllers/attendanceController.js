const logger = require("../configs/logger");
const attendanceService = require("../services/attendanceService");

class AttendanceController {
  async getAttendanceData(req, res, next) {
    try {
      const { year, month } = req.validatedParams;

      logger.info("Fetching attendance data", { year, month });
      const data = await attendanceService.getAttendanceData(year, month);

      if (!data || (Array.isArray(data) && data.length === 0)) {
        logger.warn("No attendance data found", { year, month });
        return res.status(404).json({
          success: false,
          message: "No attendance records found for the specified period",
        });
      }

      logger.debug("Attendance data retrieved successfully", {
        year,
        month,
        recordCount: data.length,
      });

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error("Error in getAttendanceData", {
        error: error.message,
        stack: error.stack,
      });
      next();
    }
  }

  async createAttendanceData(req, res, next) {
    try {
      const { year, month } = req.validatedParams;
      const data = req.body.data;

      const userId = "user123"; // Assume this is the user ID of the logged-in user
      const result = await attendanceService.createAttendanceData(
        userId,
        year,
        month,
        data
      );

      return res.status(201).json({
        success: true,
        message: "Attendance record created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAttendanceData(req, res, next) {
    try {
      const { year, month } = req.validatedParams;
      const { attendance } = req.body;

      logger.info("Updating attendance records", {
        year,
        month,
        recordCount: attendance.length,
      });

      const result = await attendanceService.updateAttendanceData(
        year,
        month,
        attendance
      );

      return res.status(200).json({
        success: true,
        message: "Attendance records updated successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error in updateAttendanceData", {
        error: error.message,
        stack: error.stack,
      });
      next();
    }
  }

  async deleteAttendanceData(req, res, next) {
    try {
      const { year, month } = req.validatedParams;

      logger.info("Deleting attendance records", { year, month });

      await attendanceService.deleteAttendanceData(year, month);

      return res.status(200).json({
        success: true,
        message: "Attendance records deleted successfully",
      });
    } catch (error) {
      logger.error("Error in deleteAttendanceData", {
        error: error.message,
        stack: error.stack,
      });
      next();
    }
  }
}

module.exports = new AttendanceController();
