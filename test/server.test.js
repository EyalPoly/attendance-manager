const request = require("supertest");
const { createApp } = require("../server");

// Mock dependencies
jest.mock("@eyal-poly/shared-logger", () => {
  const mockLoggerInstance = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  return {
    getInstance: jest.fn(() => mockLoggerInstance),
  };
});

jest.mock("@eyal-poly/shared-logger", () => ({
  getInstance: () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

jest.mock("../src/services/secretConfigService", () => {
  return {
    loadSecrets: jest.fn(),
  };
});

jest.mock("../src/configs/database", () => {
  const mockDatabaseInstance = {
    connect: jest.fn(),
  };

  return jest.fn(() => mockDatabaseInstance);
});

jest.mock("../src/controllers/attendanceController", () => ({
  getAttendanceRecord: jest.fn((req, res, next) => {
    res.status(200).json({ test: "data" });
    next();
  }),
  createAttendanceRecord: jest.fn(),
  updateAttendanceRecord: jest.fn(),
  deleteAttendanceRecord: jest.fn(),
}));

jest.mock("../src/middlewares/attendanceValidation", () => ({
  validateAttendanceParams: jest.fn((req, res, next) => next()),
  validateAttendanceBody: jest.fn((req, res, next) => next()),
}));

let app;

beforeAll(async () => {
  app = await createApp();
});

afterAll(() => {
  jest.clearAllMocks();
});

describe("Server Tests", () => {
  test("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/api/v1/unknown");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Route not found" });
  });

  test("should return appropriate response from /api/v1/attendance route", async () => {
    const res = await request(app).get("/api/v1/attendance/2024/01");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ test: "data" });
  });
});
