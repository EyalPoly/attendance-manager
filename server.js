const express = require("express");
const app = express();
require("dotenv").config();
const logger = require("./src/configs/logger");
const database = require("./src/configs/database");
const attendanceRouter = require("./src/routes/attendanceRoute");

async function startServer() {
  try {
    app.use(express.json());
    app.use("/api/v1/attendance", attendanceRouter);
    app.use((req, res, next) => {
      res.status(404).json({ error: "Route not found" });
    });

    await database.connect();

    app.listen(process.env.PORT || 3000, () => {
      logger.info(`Server is running on port ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();