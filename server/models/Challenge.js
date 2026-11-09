const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  sector: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: String, required: true },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Challenge', challengeSchema);