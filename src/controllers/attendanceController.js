const Logger = require("../configs/Logger");
const logger = new Logger();
const attendanceService = require("../services/attendanceService");

class AttendanceController {
  async getAttendanceRecord(req, res, next) {
    try {
      const { year, month } = req.validatedParams;

      const userId = "user123"; // Assume this is the user ID of the logged-in user

      logger.info(
        "Fetching attendance record: " +
          year +
          "/" +
          month +
          " for user: " +
          userId
      );
      const data = await attendanceService.getAttendanceRecord(
        userId,
        year,
        month
      );

      if (!data || (Array.isArray(data) && data.length === 0)) {
        const notFoundMessage =
          "No attendance records found for user: " +
          userId +
          " for the specified period: " +
          year +
          "/" +
          month;
        logger.warn(notFoundMessage);

        return res.status(404).json({
          success: false,
          message: notFoundMessage,
        });
      }

      logger.debug(
        "Attendance record: " +
          year +
          "/" +
          month +
          " for user: " +
          userId +
          " retrieved successfully: " +
          data
      );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAttendanceRecord(req, res, next) {
    try {
      const { year, month } = req.validatedParams;
      const data = req.body.data;

      const userId = "user123"; // Assume this is the user ID of the logged-in user

      logger.info(
        "Creating attendance record for user: " +
          userId +
          " for date: " +
          year +
          "/" +
          month
      );

      const result = await attendanceService.createAttendanceRecord(
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

  async updateAttendanceRecord(req, res, next) {
    try {
      const { year, month } = req.validatedParams;
      const data = req.body.data;

      const userId = "user123"; // Assume this is the user ID of the logged-in user

      logger.info(
        "Updating attendance record for user: " +
          userId +
          " for date: " +
          year +
          "/" +
          month
      );

      const result = await attendanceService.updateAttendanceRecord(
        userId,
        year,
        month,
        data
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

  async deleteAttendanceRecord(req, res, next) {
    try {
      const { year, month } = req.validatedParams;

      const userId = "user123"; // Assume this is the user ID of the logged-in user

      logger.info(
        "Deleting attendance records",
        year + "/" + month,
        "for user",
        userId
      );

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
