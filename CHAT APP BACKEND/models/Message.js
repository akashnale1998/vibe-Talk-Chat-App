// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' }, // allow empty if you support file-only messages
  delivered: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  new: { type: Boolean, default: false },
  deleteForEveryone: { type: Boolean, default: false },
  deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  // isTyping: { type: Boolean, default: false },


}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
