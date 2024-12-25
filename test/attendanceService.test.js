const AttendanceService = require("../src/services/attendanceService");
const AttendanceData = require("../src/models/attendanceData");
const Logger = require("../src/configs/Logger");

jest.mock("../src/models/attendanceData");
jest.mock("../src/configs/Logger", () => {
  const mockLoggerInstance = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  return jest.fn(() => mockLoggerInstance);
});

describe("AttendanceService", () => {
  const mockData = {
    data: {
      1: {
        workplace: "1בית ספר",
        isAbsence: false,
        startHour: "09:00",
        endHour: "17:00",
        frontalHours: 3,
        individualHours: 2,
        stayingHours: 2,
        comments: "Hi",
      },
      2: {
        workplace: "2בית ספר",
        isAbsence: false,
        startHour: "09:00",
        endHour: "17:00",
        frontalHours: 3,
        individualHours: 5,
        stayingHours: 1,
        comments: "Hi2",
      },
    },
  };

  const mockAttendanceDoc = {
    userId: "user123",
    year: 2023,
    month: 1,
    data: mockData,
  };

  beforeEach(() => {
    loggerInstance = new Logger();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createAttendanceRecord", () => {
    it("should create a new attendance record", async () => {
      AttendanceData.prototype.save = jest
        .fn()
        .mockResolvedValue(mockAttendanceDoc);

      const result = await AttendanceService.createAttendanceRecord(
        mockAttendanceDoc.userId,
        mockAttendanceDoc.year,
        mockAttendanceDoc.month,
        mockData
      );

      expect(AttendanceData.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(mockAttendanceDoc);
    });

    it("should log and throw an error if an error occurs during the process", async () => {
      AttendanceData.prototype.save.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        AttendanceService.createAttendanceRecord(
          mockAttendanceDoc.userId,
          mockAttendanceDoc.year,
          mockAttendanceDoc.month,
          mockData
        )
      ).rejects.toThrow("Database error");

      expect(loggerInstance.error).toHaveBeenCalledWith(
        "Error in createAttendanceData: ",
        new Error("Database error")
      );
    });
  });

  describe("getAttendanceRecord", () => {
    it("should return an attendance record if exist", async () => {
      AttendanceData.findOne = jest.fn().mockResolvedValue(mockAttendanceDoc);

      const result = await AttendanceService.getAttendanceRecord(
        mockAttendanceDoc.userId,
        mockAttendanceDoc.year,
        mockAttendanceDoc.month
      );

      expect(AttendanceData.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockAttendanceDoc);
    });

    it("should return null if the attendance record does not exist", async () => {
      AttendanceData.findOne = jest.fn().mockResolvedValue(null);

      const result = await AttendanceService.getAttendanceRecord(
        mockAttendanceDoc.userId,
        mockAttendanceDoc.year,
        mockAttendanceDoc.month
      );

      expect(AttendanceData.findOne).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should log and throw an error if an error occurs during the process", async () => {
      AttendanceData.findOne.mockRejectedValue(new Error("Database error"));

      await expect(
        AttendanceService.getAttendanceRecord(
          mockAttendanceDoc.userId,
          mockAttendanceDoc.year,
          mockAttendanceDoc.month
        )
      ).rejects.toThrow("Database error");

      expect(loggerInstance.error).toHaveBeenCalledWith(
        "Error in getAttendanceData: ",
        new Error("Database error")
      );
    });
  });
  describe("updateAttendanceRecord", () => {
    it("should update an attendance record if exist", async () => {
      AttendanceData.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockAttendanceDoc);

      const result = await AttendanceService.updateAttendanceRecord(
        mockAttendanceDoc.userId,
        mockAttendanceDoc.year,
        mockAttendanceDoc.month,
        mockData
      );

      expect(AttendanceData.findOneAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(mockAttendanceDoc);
    });

    it("should log and throw an error if an error occurs during the process", async () => {
      AttendanceData.findOneAndUpdate.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        AttendanceService.updateAttendanceRecord(
          mockAttendanceDoc.userId,
          mockAttendanceDoc.year,
          mockAttendanceDoc.month,
          mockData
        )
      ).rejects.toThrow("Database error");

      expect(loggerInstance.error).toHaveBeenCalledWith(
        "Error in updateAttendanceRecord: ",
        new Error("Database error")
      );
    });

    it("should return null if the attendance record does not exist", async () => {
      AttendanceData.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const result = await AttendanceService.updateAttendanceRecord(
        mockAttendanceDoc.userId,
        mockAttendanceDoc.year,
        mockAttendanceDoc.month,
        mockData
      );

      expect(AttendanceData.findOneAndUpdate).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("deleteAttendanceRecord", () => {
    it("should delete an attendance record if exist", async () => {
      AttendanceData.findOneAndDelete = jest
        .fn()
        .mockResolvedValue(mockAttendanceDoc);

      const result = await AttendanceService.deleteAttendanceRecord(
        mockAttendanceDoc.userId,
        mockAttendanceDoc.year,
        mockAttendanceDoc.month
      );

      expect(AttendanceData.findOneAndDelete).toHaveBeenCalled();
      expect(result).toEqual(mockAttendanceDoc);
    });

    it("should log and throw an error if an error occurs during the process", async () => {
      AttendanceData.findOneAndDelete.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        AttendanceService.deleteAttendanceRecord(
          mockAttendanceDoc.userId,
          mockAttendanceDoc.year,
          mockAttendanceDoc.month
        )
      ).rejects.toThrow("Database error");

      expect(loggerInstance.error).toHaveBeenCalledWith(
        "Error in deleteAttendanceRecord: ",
        new Error("Database error")
      );
    });

    it("should return null if the attendance record does not exist", async () => {
      AttendanceData.findOneAndDelete = jest.fn().mockResolvedValue(null);

      const result = await AttendanceService.deleteAttendanceRecord(
        mockAttendanceDoc.userId,
        mockAttendanceDoc.year,
        mockAttendanceDoc.month
      );

      expect(AttendanceData.findOneAndDelete).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
