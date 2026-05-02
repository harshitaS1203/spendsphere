const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  splitBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  splitType: { type: String, enum: ['equal', 'custom', 'percentage'], default: 'equal' },
  category: { type: String, enum: ['Travel', 'Food', 'Shopping', 'Others'], default: 'Others' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
