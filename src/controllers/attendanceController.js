const attendanceService = require('../services/attendanceService');

exports.getAttendanceData = async (req, res) => {
  const year = req.params.year;
  const month = req.params.month;
  const data = await attendanceService.getAttendanceData(year, month);
  res.json(data);
}