const {
  body,
  validationResult,
  checkSchema,
  check,
} = require("express-validator");

export const validateAttendanceBodyRequest = checkSchema({
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
});
