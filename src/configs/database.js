const mongoose = require("mongoose");
const Logger = require("./Logger");
const logger = new Logger();

class Database {
  constructor() {
    this.mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/attendance_manager";
    this.options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
  }

  async connect() {
    try {
      logger.info("Attempting to connect to MongoDB...");

      mongoose.connection.on("error", (error) => {
        logger.error("MongoDB connection error:", error);
      });

      mongoose.connection.once("open", () => {
        logger.info("Successfully connected to MongoDB");
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("Lost MongoDB connection. Attempting to reconnect...");
      });

      mongoose.connection.on("reconnected", () => {
        logger.info("Successfully reconnected to MongoDB");
      });

      process.on("SIGINT", async () => {
        try {
          await mongoose.connection.close();
          logger.info("MongoDB connection closed through app termination");
          process.exit(0);
        } catch (err) {
          logger.error("Error during MongoDB disconnection:", err);
          process.exit(1);
        }
      });

      await mongoose.connect(this.mongoURI, this.options);

      this.startConnectionMonitoring();

      return mongoose.connection;
    } catch (err) {
      logger.error("Failed to connect to MongoDB:", {
        error: err.message || "Unknown error",
        stack: err.stack || "No stack trace",
        mongoURI: this.mongoURI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"), // Hide credentials in logs
      });
      throw err;
    }
  }

  startConnectionMonitoring() {
    setInterval(() => {
      const state = mongoose.connection.readyState;
      const states = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
      };

      if (state !== 1) {
        logger.warn("MongoDB connection state changed:", {
          currentState: states[state] || "unknown",
        });
      }
    }, 30000); // Check every 30 seconds
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed successfully");
    } catch (err) {
      logger.error("Error while closing MongoDB connection:", err);
      throw err;
    }
  }
}

module.exports = Database;
