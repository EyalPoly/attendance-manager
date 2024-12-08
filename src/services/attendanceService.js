const logger = require("../configs/logger");
const AttendanceData = require("../models/attendanceData");

class AttendanceService {
  async getAttendanceData(year, month) {}

  async createAttendanceData(userId, year, month, data) {
    try {
      const attendanceDataRecord = await AttendanceData.findOne({
        userId: userId,
        year: year,
        month: month,
      });

      if (attendanceDataRecord !== null) {
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

      const doc = await this.saveAttendanceDocument(userId, year, month, data);

      return doc;
    } catch (error) {
      logger.error("Error in createAttendanceData: ", error);
      throw error;
    }
  }

  async updateAttendanceData(year, month, attendanceRecords) {}

  async deleteAttendanceData(year, month) {}

  async saveAttendanceDocument(userId, year, month, data) {
    try {
      const newAttendanceData = new AttendanceData({
        userId,
        year,
        month,
        data,
      });
      const doc = await newAttendanceData.save();
      logger.info("Created attendance record: ", {
        userId,
        year,
        month,
      });
      return doc;
    } catch (error) {
      logger.error("Error saving attendance document", {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

module.exports = new AttendanceService();
