const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: String,
  restaurantPhone: String,
  address: String,
  city: String,
  state: String,
  pinCode: String,
  cuisine: String,
  description: String,
  subscriptionPlan: {
    type: String,
    enum: ['trial', 'subscription'],
    default: 'trial'
  },
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);