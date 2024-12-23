const request = require("supertest");
const express = require("express");
const {
  validateAttendanceParams,
  validateAttendanceBody,
} = require("../src/middlewares/attendanceValidation");

const app = express();
app.use(express.json());

app.get("/attendance/:year/:month", validateAttendanceParams, (req, res) => {
  res.status(200).json({ message: "Valid parameters" });
});

app.post("/attendance", validateAttendanceBody, (req, res) => {
  res.status(200).json({ message: "Valid body" });
});

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


describe("validateAttendanceParams Middleware", () => {
  it("should return 400 if year is not a number", async () => {
    const res = await request(app).get("/attendance/abcd/01");
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Year must be a number");
  });

  it("should return 400 if month is not a number", async () => {
    const res = await request(app).get("/attendance/2023/ab");
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Month must be a number");
  });

  it("should return 400 if year is not 4 digits", async () => {
    const res = await request(app).get("/attendance/202/01");
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Year must be 4 digits");
  });

  it("should return 400 if month is not 2 digits", async () => {
    const res = await request(app).get("/attendance/2023/1");
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Month must be 2 digits");
  });

  it("should return 400 if month is not between 01 and 12", async () => {
    const res = await request(app).get("/attendance/2023/13");
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Month must be between 1 and 12");
  });

  it("should return 200 if parameters are valid", async () => {
    const res = await request(app).get("/attendance/2023/12");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Valid parameters");
  });
});

describe("validateAttendanceBody Middleware", () => {
  it("should return 400 if data is not an object", async () => {
    const res = await request(app)
      .post("/attendance")
      .send({ data: "not an object" });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Data must be an object");
  });

  it("should return 400 if day number is invalid", async () => {
    const res = await request(app)
      .post("/attendance")
      .send({ data: { invalidDay: mockData.data[1] } });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid day number: invalidDay");
  });

  it("should return 400 if workplace is not a string", async () => {
    const invalidWorkspaceData = JSON.parse(JSON.stringify(mockData.data[1]));
    invalidWorkspaceData.workplace = 123;

    const res = await request(app)
      .post("/attendance")
      .send({ data: { 1: invalidWorkspaceData } });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Workplace must be a string");
  });

  it("should return 400 if isAbsence is not a boolean", async () => {
    const invalidIsAbsenceData = JSON.parse(JSON.stringify(mockData.data[1]));
    invalidIsAbsenceData.isAbsence = "not boolean";

    const res = await request(app)
      .post("/attendance")
      .send({ data: { 1: invalidIsAbsenceData } });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("isAbsence must be a boolean");
  });

  it("should return 400 if startHour is not in HH:MM format", async () => {
    const invalidStartHourData = JSON.parse(JSON.stringify(mockData.data[1]));
    invalidStartHourData.startHour = "invalid";

    const res = await request(app)
      .post("/attendance")
      .send({ data: { 1: invalidStartHourData } });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Start hour must be in HH:MM format");
  });

  it("should return 400 if endHour is not in HH:MM format", async () => {
    const invalidEndHourData = JSON.parse(JSON.stringify(mockData.data[1]));
    invalidEndHourData.endHour = "invalid";

    const res = await request(app)
      .post("/attendance")
      .send({ data: { 1: invalidEndHourData } });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("End hour must be in HH:MM format");
  });

  it("should return 400 if frontalHours is not a number", async () => {
    const invalidFrontalHoursData = JSON.parse(JSON.stringify(mockData.data[1]));
    invalidFrontalHoursData.frontalHours = "not a number";

    const res = await request(app)
      .post("/attendance")
      .send({ data: { 1: invalidFrontalHoursData } });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Frontal hours must be a number");
  });

  it("should return 400 if individualHours is not a number", async () => {
    const invalidIndividualHoursData = JSON.parse(JSON.stringify(mockData.data[1]));
    invalidIndividualHoursData.individualHours = "not a number";

    const res = await request(app)
      .post("/attendance")
      .send({ data: { 1: invalidIndividualHoursData } });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Individual hours must be a number");
  });

  it("should return 400 if stayingHours is not a number", async () => {
    const invalidStayingHoursData = JSON.parse(JSON.stringify(mockData.data[1]));
    invalidStayingHoursData.stayingHours = "not a number";

    const res = await request(app)
      .post("/attendance")
      .send({ data: { 1: invalidStayingHoursData } });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Staying hours must be a number");
  });

  it("should return 200 if body is valid", async () => {
    const res = await request(app)
      .post("/attendance")
      .send({
        data: {
          1: {
            workplace: "Office",
            isAbsence: false,
            startHour: "09:00",
            endHour: "17:00",
            frontalHours: 8,
            individualHours: 2,
            stayingHours: 1,
            comments: "Worked from home",
          },
        },
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Valid body");
  });
});
