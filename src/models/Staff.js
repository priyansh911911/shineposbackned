const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['MANAGER', 'CHEF', 'WAITER', 'CASHIER'],
    required: true
  },
  permissions: [{
    type: String,
    enum: ['orders', 'menus', 'inventory', 'staff', 'reports', 'kitchen']
  }],
  phone: String,
  hourlyRate: {
    type: Number,
    default: 0
  },
  overtimeRate: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  workingHours: {
    standardHours: { type: Number, default: 8 }
  },
  shiftSchedule: {
    type: {
      type: String,
      enum: ['fixed', 'rotating', 'flexible'],
      default: 'fixed'
    },
    fixedShift: {
      startTime: String, // "09:00"
      endTime: String,   // "17:00"
      workingDays: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }]
    },
    rotatingShifts: [{
      name: String,
      startTime: String,
      endTime: String,
      workingDays: [String]
    }]
  },
  shifts: [{
    date: Date,
    startTime: String,
    endTime: String,
    shiftType: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'missed', 'cancelled'],
      default: 'scheduled'
    }
  }],
  performance: {
    ordersProcessed: { type: Number, default: 0 },
    averageOrderTime: { type: Number, default: 0 },
    customerRating: { type: Number, default: 0 }
  },

}, {
  timestamps: true
});

module.exports = staffSchema;