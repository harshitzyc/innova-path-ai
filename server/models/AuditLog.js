const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  user: { type: String, required: true },
  action: { type: String, required: true },
  module: { type: String, required: true },
  refId: { type: String, required: true },
  status: { type: String, default: 'Success' }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);