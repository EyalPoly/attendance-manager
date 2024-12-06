const express = require('express');
const router = express.Router();

router.get('/:year/:month', (req, res) => {
    res.send('Attendance date: ' + req.params.year + '/' + req.params.month);
});

module.exports = router;