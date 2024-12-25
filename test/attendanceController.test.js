const request = require("supertest");
const express = require("express");
const AttendanceController = require("../src/controllers/attendanceController");
const attendanceService = require("../src/services/attendanceService");
const attendanceController = require("../src/controllers/attendanceController");
const {
  validateAttendanceParams,
  validateAttendanceBody,
} = require("../src/middlewares/attendanceValidation");

jest.mock("../src/services/attendanceService", () => ({
  createAttendanceRecord: jest.fn(),
  getAttendanceRecord: jest.fn(),
  updateAttendanceRecord: jest.fn(),
  deleteAttendanceRecord: jest.fn(),
}));

jest.mock("../src/configs/logger");

const validParams = {
  year: 2024,
  month: 12,
};

jest.mock("../src/middlewares/attendanceValidation", () => ({
  validateAttendanceParams: jest.fn((req, res, next) => {
    req.validatedParams = validParams;
    next();
  }),
  validateAttendanceBody: jest.fn((req, res, next) => {
    next();
  }),
}));

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

const userId = "user123";

const mockAttendanceRecord = {
  userId: userId,
  year: validParams.year,
  month: validParams.month,
  data: mockData,
};

const app = express();
app.use(express.json());
app.get(
  "/attendance",
  validateAttendanceParams,
  attendanceController.getAttendanceRecord
);
app.post(
  "/attendance",
  validateAttendanceParams,
  attendanceController.createAttendanceRecord
);
app.put(
  "/attendance",
  validateAttendanceParams,
  validateAttendanceBody,
  attendanceController.updateAttendanceRecord
);
app.delete(
  "/attendance",
  validateAttendanceParams,
  attendanceController.deleteAttendanceRecord
);

describe("AttendanceController", () => {
  describe("createAttendanceRecord", () => {
    it("should return 201 and create attendance record", async () => {
      attendanceService.createAttendanceRecord.mockResolvedValue(
        mockAttendanceRecord
      );

      const res = await request(app).post("/attendance").send(mockData);

      expect(attendanceService.createAttendanceRecord).toHaveBeenCalledWith(
        userId,
        validParams.year,
        validParams.month,
        mockData.data
      );
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockAttendanceRecord);
    });

    it("should handle errors", async () => {
      attendanceService.createAttendanceRecord.mockRejectedValue(
        new Error("Failed to create attendance record")
      );

      const res = await request(app).post("/attendance").send(mockData);

      expect(res.status).toBe(500);
    });

    it("should return 409 if attendance record already exists", async () => {
      attendanceService.getAttendanceRecord.mockResolvedValue({
        mockAttendanceRecord,
      });

      const res = await request(app).post("/attendance").send(mockData);

      expect(res.status).toBe(409);
      expect(attendanceService.getAttendanceRecord).toHaveBeenCalledWith(
        userId,
        validParams.year,
        validParams.month
      );
    });
  });
  describe("getAttendanceRecord", () => {
    it("should return 200 and get attendance record", async () => {
      attendanceService.getAttendanceRecord.mockResolvedValue(
        mockAttendanceRecord
      );

      const res = await request(app).get("/attendance");

      expect(attendanceService.getAttendanceRecord).toHaveBeenCalledWith(
        userId,
        validParams.year,
        validParams.month
      );
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockAttendanceRecord);
    });

    it("should handle errors", async () => {
      attendanceService.getAttendanceRecord.mockRejectedValue(
        new Error("Failed to get attendance record")
      );

      const res = await request(app).get("/attendance");

      expect(res.status).toBe(500);
    });

    it("should return 404 if attendance record not found", async () => {
      attendanceService.getAttendanceRecord.mockResolvedValue(null);

      const res = await request(app).get("/attendance");

      expect(res.status).toBe(404);
    });
  });
  describe("updateAttendanceRecord", () => {
    it("should return 200 and update attendance record if exist", async () => {
      attendanceService.updateAttendanceRecord.mockResolvedValue(
        mockAttendanceRecord
      );
      attendanceService.getAttendanceRecord.mockResolvedValue(
        mockAttendanceRecord
      );

      const res = await request(app).put("/attendance").send(mockData);

      expect(attendanceService.updateAttendanceRecord).toHaveBeenCalledWith(
        userId,
        validParams.year,
        validParams.month,
        mockData.data
      );
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockAttendanceRecord);
    });

    it("should handle errors", async () => {
      attendanceService.updateAttendanceRecord.mockRejectedValue(
        new Error("Failed to update attendance record")
      );

      const res = await request(app).put("/attendance").send(mockData);

      expect(res.status).toBe(500);
    });

    it("should return 404 if attendance record not found", async () => {
      attendanceService.getAttendanceRecord.mockResolvedValue(null);

      const res = await request(app).put("/attendance").send(mockData);

      expect(res.status).toBe(404);
    });
  });

  describe("deleteAttendanceRecord", () => {
    it("should return 200 and delete attendance record", async () => {
      attendanceService.deleteAttendanceRecord.mockResolvedValue(
        mockAttendanceRecord
      );

      const res = await request(app).delete("/attendance");

      expect(attendanceService.deleteAttendanceRecord).toHaveBeenCalledWith(
        userId,
        validParams.year,
        validParams.month
      );
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should handle errors", async () => {
      attendanceService.deleteAttendanceRecord.mockRejectedValue(
        new Error("Failed to delete attendance record")
      );

      const res = await request(app).delete("/attendance");

      expect(res.status).toBe(500);
    });

    it("should return 404 if attendance record not found", async () => {
      attendanceService.deleteAttendanceRecord.mockRejectedValue(null);

      const res = await request(app).delete("/attendance");

      expect(res.status).toBe(404);
    });
  });
});
