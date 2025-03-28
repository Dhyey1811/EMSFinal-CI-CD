const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  title: { type: String, enum: ['Employee', 'Manager', 'Director', 'VP'], required: true },
  department: { type: String, enum: ['IT', 'Marketing', 'HR', 'Engineering'], required: true },
  employeeType: { type: String, enum: ['FullTime', 'PartTime', 'Contract', 'Seasonal'], required: true },
  currentStatus: { type: Boolean, default: true }, 
});

module.exports = mongoose.model('Employee', employeeSchema);
