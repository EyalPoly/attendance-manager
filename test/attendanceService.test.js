const AttendanceService = require("../src/services/attendanceService");
const AttendanceData = require("../src/models/attendanceData");
const Logger = require("../src/configs/Logger");

jest.mock("../src/models/attendanceData");
jest.mock("../src/configs/Logger", () => {
  const mockLoggerInstance = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
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
    it("should create a new attendance record if it does not exist", async () => {
      AttendanceData.findOne.mockResolvedValue(null);
      AttendanceData.prototype.save = jest
        .fn()
        .mockResolvedValue(mockAttendanceDoc);

      const result = await AttendanceService.createAttendanceRecord(
        mockAttendanceDoc.userId,
        mockAttendanceDoc.year,
        mockAttendanceDoc.month,
        mockData
      );

      expect(AttendanceData.findOne).toHaveBeenCalledWith({
        userId: mockAttendanceDoc.userId,
        year: mockAttendanceDoc.year,
        month: mockAttendanceDoc.month,
      });
      expect(AttendanceData.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(mockAttendanceDoc);
    });

    it("should throw an error if the attendance record already exists", async () => {
      AttendanceData.findOne.mockResolvedValue(mockAttendanceDoc);

      await expect(
        AttendanceService.createAttendanceRecord(
          mockAttendanceDoc.userId,
          mockAttendanceDoc.year,
          mockAttendanceDoc.month,
          mockData
        )
      ).rejects.toThrow(
        "Attendance record for user: " +
          mockAttendanceDoc.userId +
          " for date: " +
          mockAttendanceDoc.year +
          "/" +
          mockAttendanceDoc.month +
          " already exists"
      );
      expect(AttendanceData.findOne).toHaveBeenCalledWith({
        userId: mockAttendanceDoc.userId,
        year: mockAttendanceDoc.year,
        month: mockAttendanceDoc.month,
      });
      try {
        await AttendanceService.createAttendanceRecord(
          mockAttendanceDoc.userId,
          mockAttendanceDoc.year,
          mockAttendanceDoc.month,
          mockData
        );
      }
      catch (error) {
        expect(error.status).toBe(409);
      }
    });

    it("should log and throw an error if an error occurs during the process", async () => {
      AttendanceData.findOne.mockRejectedValue(new Error("Database error"));

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
});
