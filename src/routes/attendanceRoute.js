const express = require('express');
const router = express.Router();
const validateAttendanceRequest = require('../middlewares/validateAttendanceParamRequest');
const attendanceController = require('../controllers/attendanceController');


router.get('/:year/:month', attendanceController.getAttendanceData);
router.post('/:year/:month', attendanceController.createAttendanceData);

module.exports = router;