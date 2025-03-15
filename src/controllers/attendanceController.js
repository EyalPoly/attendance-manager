const Logger = require("@eyal-poly/shared-logger");
const logger = Logger.getInstance();
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
      const record = await attendanceService.getAttendanceRecord(
        userId,
        year,
        month
      );

      if (!record) {
        return AttendanceController.resourceNotFoundResponse(
          res,
          userId,
          year,
          month
        );
      }

      logger.debug(
        "Attendance record: " +
          year +
          "/" +
          month +
          " for user: " +
          userId +
          " retrieved successfully: " +
          record
      );

      return res.status(200).json({
        success: true,
        data: record,
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

      const existingRecord = await attendanceService.getAttendanceRecord(
        userId,
        year,
        month
      );
      if (existingRecord) {
        const error = new Error(
          "Attendance record for user: " +
            userId +
            " for date: " +
            year +
            "/" +
            month +
            " already exists"
        );
        error.status = 409;
        throw error;
      }

      const record = await attendanceService.createAttendanceRecord(
        userId,
        year,
        month,
        data
      );

      return res.status(201).json({
        success: true,
        message: "Attendance record created successfully",
        data: record,
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

      const oldRecord = await attendanceService.getAttendanceRecord(
        userId,
        year,
        month
      );
      if (!oldRecord) {
        return AttendanceController.resourceNotFoundResponse(
          res,
          userId,
          year,
          month
        );
      }

      const record = await attendanceService.updateAttendanceRecord(
        userId,
        year,
        month,
        data
      );

      return res.status(200).json({
        success: true,
        message: "Attendance records updated successfully",
        data: record,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAttendanceRecord(req, res, next) {
    try {
      const { year, month } = req.validatedParams;

      const userId = "user123"; // Assume this is the user ID of the logged-in user

      logger.info(
        "Deleting attendance record for user: " +
          userId +
          " for date: " +
          year +
          "/" +
          month
      );

      const record = await attendanceService.deleteAttendanceRecord(
        userId,
        year,
        month
      );

      if (!record) {
        return AttendanceController.resourceNotFoundResponse(
          res,
          userId,
          year,
          month
        );
      }

      return res.status(200).json({
        success: true,
        message: "Attendance record deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static resourceNotFoundResponse(res, userId, year, month) {
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
}

module.exports = new AttendanceController();
