import mongoose from 'mongoose';

const dayDataSchema = new mongoose.Schema({
  workplace: { type: String, required: true },
  isAbsence: { type: Boolean, required: true },
  startHour: { type: String, required: true },
  endHour: { type: String, required: true },
  frontalHours: { type: Number, required: true },
  individualHours: { type: Number, required: true },
  stayingHours: { type: Number, required: true },
  comments: { type: String, required: false },
});

const attendanceDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  data: {
    type: Map,
    of: dayDataSchema,
    required: true
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);