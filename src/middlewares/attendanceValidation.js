const { param, validationResult, checkSchema } = require("express-validator");

const validateAttendanceParams = async (req, res, next) => {
  await param("year").isNumeric().withMessage("Year must be a number").run(req);
  await param("year")
    .isLength({ min: 4, max: 4 })
    .withMessage("Year must be 4 digits")
    .run(req);

  await param("month")
    .isNumeric()
    .withMessage("Month must be a number")
    .run(req);
  await param("month")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12")
    .run(req);
  await param("month")
    .isLength({ min: 2, max: 2 })
    .withMessage("Month must be 2 digits").run(req);
    
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  req.validatedParams = {
    year: parseInt(req.params.year),
    month: parseInt(req.params.month),
  };

  next();
};

const validateAttendanceBody = async (req, res, next) => {
  await Promise.all(
    validateAttendanceSchema.map((validation) => validation.run(req))
  );
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

const validateAttendanceSchema = checkSchema({
  data: {
    in: ["body"],
    isObject: { errorMessage: "Data must be an object" },
    custom: {
      options: (value) => {
        // Ensure all keys are integers (representing day numbers)
        if (typeof value !== "object") return false;
        for (const key of Object.keys(value)) {
          if (!/^\d+$/.test(key)) {
            throw new Error(`Invalid day number: ${key}`);
          }
        }
        return true;
      },
    },
  },
  "data.*.workplace": {
    in: ["body"],
    isString: {
      errorMessage: "Workplace must be a string",
    },
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Workplace cannot be empty",
    },
  },
  "data.*.isAbsence": {
    in: ["body"],
    isBoolean: {
      errorMessage: "isAbsence must be a boolean",
    },
    toBoolean: true,
  },
  "data.*.startHour": {
    in: ["body"],
    isString: {
      errorMessage: "Start hour must be a string",
    },
    trim: true,
    escape: true,
    matches: {
      options: [/^\d{2}:\d{2}$/], // HH:MM format
      errorMessage: "Start hour must be in HH:MM format",
    },
  },
  "data.*.endHour": {
    in: ["body"],
    isString: {
      errorMessage: "End hour must be a string",
    },
    trim: true,
    escape: true,
    matches: {
      options: [/^\d{2}:\d{2}$/], // HH:MM format
      errorMessage: "End hour must be in HH:MM format",
    },
  },
  "data.*.frontalHours": {
    in: ["body"],
    isNumeric: {
      errorMessage: "Frontal hours must be a number",
    },
    toFloat: true,
  },
  "data.*.individualHours": {
    in: ["body"],
    isNumeric: {
      errorMessage: "Individual hours must be a number",
    },
    toFloat: true,
  },
  "data.*.stayingHours": {
    in: ["body"],
    isNumeric: {
      errorMessage: "Staying hours must be a number",
    },
    toFloat: true,
  },
  "data.*.comments": {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Comments must be a string",
    },
    trim: true,
    escape: true,
  },
});

module.exports = { validateAttendanceParams, validateAttendanceBody };
