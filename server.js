const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();

// MongoDB Connection
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL); 
const db = mongoose.connection;
db.on('error', (error) => console.error(error)).once('open', () => console.log('Connected to database'));

const attendanceRouter = require('./src/routes/attendanceRoute');

app.use('/api/v1/attendance', attendanceRouter);













app.listen (process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});