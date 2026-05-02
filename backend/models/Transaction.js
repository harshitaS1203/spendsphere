const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // person who owes
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   // person who gets paid
  amount: { type: Number, required: true },
  isSettled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
