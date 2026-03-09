const mongoose = require('mongoose');

const expectedRevenueSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  expectedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  actualAmount: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

expectedRevenueSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = expectedRevenueSchema;
