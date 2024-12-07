const {param, validationResult} = require('express-validator');


export const validateAttendanceRequest = (req, res, next) => {
  param('year').isNumeric().withMessage('Year must be a number');
  param('month').isNumeric().withMessage('Month must be a number');

  param('year').isLength({min: 4, max: 4}).withMessage('Year must be 4 digits');
  param('month').isLength({min: 2, max: 2}).withMessage('Month must be 2 digits');

  param('month').custom((value) => {
    if (value < 1 || value > 12) {
      throw new Error('Month must be between 01 and 12');
    }
    return true;
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  next();
}