const Logger = require("@eyal-poly/shared-logger");
const logger = Logger.getInstance();
const AttendanceData = require("../models/attendanceData");

class AttendanceService {
  async getAttendanceRecord(userId, year, month) {
    try {
      const attendanceDataRecord = await AttendanceData.findOne({
        userId: userId,
        year: year,
        month: month,
      });

      return attendanceDataRecord;
    } catch (error) {
      logger.error("Error in getAttendanceData: ", error);
      throw error;
    }
  }

  async createAttendanceRecord(userId, year, month, data) {
    try {
      const doc = await this.saveAttendanceDocument(userId, year, month, data);

      return doc;
    } catch (error) {
      logger.error("Error in createAttendanceData: ", error);
      throw error;
    }
  }

  async updateAttendanceRecord(userId, year, month, newData) {
    try {
      const filter = { userId, year, month };
      const update = { data: newData };

      const doc = await AttendanceData.findOneAndUpdate(filter, update, {
        new: true,
        upsert: false,
      });

      return doc;
    } catch (error) {
      logger.error("Error in updateAttendanceRecord: ", error);
      throw error;
    }
  }

  async deleteAttendanceRecord(userId, year, month) {
    try {
      const doc = await AttendanceData.findOneAndDelete({
        userId: userId,
        year: year,
        month: month,
      });

      return doc;
    } catch (error) {
      logger.error("Error in deleteAttendanceRecord: ", error);
      throw error;
    }
  }

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
