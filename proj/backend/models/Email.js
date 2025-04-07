const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sender: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Email', emailSchema);
