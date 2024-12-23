const winston = require("winston");
const path = require("path");
const fs = require("fs");
const DailyRotateFile = require("winston-daily-rotate-file");

const rootDir = path.resolve(process.cwd());
const combinedLogsDir = path.join(rootDir, "logs", "combined");
const errorLogsDir = path.join(rootDir, "logs", "errors");

[combinedLogsDir, errorLogsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.prettyPrint({
    depth: 5,
  }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.prettyPrint({
    depth: 5,
  }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
});

const combinedFileTransport = new DailyRotateFile({
  filename: path.join(combinedLogsDir, "%DATE%_combined.log"),
  format: fileFormat,
  datePattern: "YYYY-MM-DD-HH",
  maxSize: "2m",
  maxFiles: "14d",
});

const errorFileTransport = new DailyRotateFile({
  filename: path.join(errorLogsDir, "%DATE%_error.log"),
  level: "error",
  format: fileFormat,
  datePattern: "YYYY-MM-DD-HH",
  maxSize: "2m",
  maxFiles: "14d",
});

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
  },
};
winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels: customLevels.levels,
  transports: [errorFileTransport, combinedFileTransport, consoleTransport],
});

module.exports = logger;