const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  whatsappLink: String,
  livePrice: Number,
  webinarPrice: Number,
  isPaymentEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Settings', SettingsSchema);