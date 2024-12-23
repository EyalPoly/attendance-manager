const express = require("express");
require("dotenv").config();
const Database = require("./src/configs/Database");
const attendanceRouter = require("./src/routes/attendanceRoutes");
const Logger = require("./src/configs/Logger");

const logger = new Logger();

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/v1/attendance", attendanceRouter);
  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
  return app;
}

async function startServer() {
  try {
    const app = createApp();
    const database = new Database();
    await database.connect();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Only start the server if this file is being run directly
if (require.main === module) {
  startServer();
}

module.exports = { createApp };
