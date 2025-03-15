const request = require("supertest");
const { createApp } = require("../server");
const attendanceController = require("../src/controllers/attendanceController");


jest.mock("../src/controllers/attendanceController");

jest.mock("../src/middlewares/attendanceValidation", () => ({
  validateAttendanceParams: (req, res, next) => {
    next();
  },
  validateAttendanceBody: (req, res, next) => {
    next();
  },
}));

jest.mock("@eyal-poly/shared-logger", () => ({
  getInstance: () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

jest.mock("../src/services/secretConfigService", () => ({
  loadSecrets: jest.fn(),
}));

let app;

beforeAll(async () => {
  app = await createApp();
});

describe("Attendance Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /attendance/:year/:month", () => {
    it("should call validateAttendanceParams and getAttendanceRecord", async () => {
      attendanceController.getAttendanceRecord.mockImplementation((req, res) => {
        res.status(200).json({ success: true });
      });

      const response = await request(app).get("/api/v1/attendance/2023/10");

      expect(response.status).toBe(200);
      expect(attendanceController.getAttendanceRecord).toHaveBeenCalled();
    });
  });

  describe("POST /attendance/:year/:month", () => {
    it("should call validateAttendanceParams, validateAttendanceBody and createAttendanceRecord", async () => {
      attendanceController.createAttendanceRecord.mockImplementation(
        (req, res) => {
          res.status(201).json({ success: true });
        }
      );

      const response = await request(app)
        .post("/api/v1/attendance/2023/10")
        .send({});

      expect(response.status).toBe(201);
      expect(attendanceController.createAttendanceRecord).toHaveBeenCalled();
    });
  });

  describe("PUT /attendance/:year/:month", () => {
    it("should call validateAttendanceParams, validateAttendanceBody and updateAttendanceRecord", async () => {
      attendanceController.updateAttendanceRecord.mockImplementation(
        (req, res) => {
          res.status(200).json({ success: true });
        }
      );

      const response = await request(app)
        .put("/api/v1/attendance/2023/10")
        .send( {});

      expect(response.status).toBe(200);
      expect(attendanceController.updateAttendanceRecord).toHaveBeenCalled();
    });
  });

  describe("DELETE /attendance/:year/:month", () => {
    it("should call validateAttendanceParams and deleteAttendanceRecord", async () => {
      attendanceController.deleteAttendanceRecord.mockImplementation(
        (req, res) => {
          res.status(200).json({ success: true });
        }
      );

      const response = await request(app).delete("/api/v1/attendance/2023/10");

      expect(response.status).toBe(200);
      expect(attendanceController.deleteAttendanceRecord).toHaveBeenCalled();
    });
  });
});
