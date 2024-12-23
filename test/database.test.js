const mongoose = require("mongoose");
const Logger = require("../src/configs/Logger");
const Database = require("../src/configs/Database");

jest.mock("mongoose", () => ({
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
    once: jest.fn(),
    readyState: 1,
    close: jest.fn(),
  },
}));

jest.mock("../src/configs/Logger", () => {
  const mockLoggerInstance = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  return jest.fn(() => mockLoggerInstance);
});

describe("Database", () => {
  let database;
  let loggerInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    loggerInstance = new Logger();
    database = new Database();
  });

  describe("connect", () => {
    it("should log successful connection", async () => {
      mongoose.connect.mockResolvedValueOnce();
      mongoose.connection.on.mockImplementation((event, callback) =>
        callback()
      );
      mongoose.connection.once.mockImplementation((event, callback) =>
        callback()
      );

      await database.connect();

      expect(loggerInstance.info).toHaveBeenCalledWith(
        "Attempting to connect to MongoDB..."
      );
      expect(loggerInstance.info).toHaveBeenCalledWith(
        "Successfully connected to MongoDB"
      );
    });

    it("should log and throw error on connection failure", async () => {
      const error = new Error("Connection failed");
      mongoose.connect.mockRejectedValueOnce(error);

      await expect(database.connect()).rejects.toThrow(error);

      expect(loggerInstance.error).toHaveBeenCalledWith(
        "Failed to connect to MongoDB:",
        expect.objectContaining({
          error: error.message,
          stack: error.stack,
          mongoURI: expect.any(String),
        })
      );
    });

    it("should log and monitor events", async () => {
      mongoose.connect.mockResolvedValueOnce();
      const mockOn = jest.fn();
      const mockOnce = jest.fn();
      mongoose.connection.on = mockOn;
      mongoose.connection.once = mockOnce;

      await database.connect();

      expect(mockOn).toHaveBeenCalledWith("error", expect.any(Function));
      expect(mockOnce).toHaveBeenCalledWith("open", expect.any(Function));
      expect(mockOn).toHaveBeenCalledWith("disconnected", expect.any(Function));
      expect(mockOn).toHaveBeenCalledWith("reconnected", expect.any(Function));
    });
  });

  describe("disconnect", () => {
    it("should log successful disconnection", async () => {
      mongoose.connection.close.mockResolvedValueOnce();

      await database.disconnect();

      expect(mongoose.connection.close).toHaveBeenCalled();
      expect(loggerInstance.info).toHaveBeenCalledWith(
        "MongoDB connection closed successfully"
      );
    });

    it("should log and throw error on disconnection failure", async () => {
      const error = new Error("Disconnection failed");
      mongoose.connection.close.mockRejectedValueOnce(error);

      await expect(database.disconnect()).rejects.toThrow(error);

      expect(loggerInstance.error).toHaveBeenCalledWith(
        "Error while closing MongoDB connection:",
        error
      );
    });
  });

  describe("startConnectionMonitoring", () => {
    jest.useFakeTimers();

    it("should log warnings for non-connected states", () => {
      mongoose.connection.readyState = 0; // Simulate "disconnected" state
      database.startConnectionMonitoring();

      jest.advanceTimersByTime(30000); // Advance time by 30 seconds

      expect(loggerInstance.warn).toHaveBeenCalledWith(
        "MongoDB connection state changed:",
        {
          currentState: "disconnected",
        }
      );
    });

    it("should not log warnings for connected state", () => {
      mongoose.connection.readyState = 1; // Simulate "connected" state
      database.startConnectionMonitoring();

      jest.advanceTimersByTime(30000); // Advance time by 30 seconds

      expect(loggerInstance.warn).not.toHaveBeenCalled();
    });
  });

  describe("Signal Handling", () => {
    it("should close connection on SIGINT", async () => {
      const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
      mongoose.connection.close.mockResolvedValueOnce();
      const exitPromise = new Promise((resolve) => {
        mockExit.mockImplementationOnce((code) => {
          resolve(code);
          return undefined;
        });
      });

      await database.connect();

      process.emit("SIGINT");
      await exitPromise;

      expect(mongoose.connection.close).toHaveBeenCalled();
      expect(loggerInstance.info).toHaveBeenCalledWith(
        "MongoDB connection closed through app termination"
      );
      expect(mockExit).toHaveBeenCalledWith(0);

      mockExit.mockRestore();
    });

    it("should log error and exit with code 1 on disconnection failure during SIGINT", async () => {
      const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
      const error = new Error("Disconnection failed");
      mongoose.connection.close.mockRejectedValueOnce(error);
      const exitPromise = new Promise((resolve) => {
        mockExit.mockImplementationOnce((code) => {
          resolve(code);
          return undefined;
        });
      });

      await database.connect();

      process.emit("SIGINT");
      await exitPromise;

      expect(loggerInstance.error).toHaveBeenCalledWith(
        "Error during MongoDB disconnection:",
        error
      );
      expect(mockExit).toHaveBeenCalledWith(1);      

      mockExit.mockRestore();
    });
  });
});
