const Expense = require('../models/Expense');
const Transaction = require('../models/Transaction');

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { groupId, description, amount, paidBy, splitBetween, splitType, category } = req.body;
    
    const expense = await Expense.create({
      groupId,
      description,
      amount,
      paidBy,
      splitBetween,
      splitType,
      category
    });

    // Simple equal split logic: calculate how much each person owes the payer
    if ((splitType === 'equal' || splitType === 'custom') && splitBetween && splitBetween.length > 0) {
      const splitAmount = amount / splitBetween.length;
      
      const transactions = [];
      for (const userId of splitBetween) {
        // If the user is not the one who paid, they owe the payer
        if (userId.toString() !== paidBy.toString()) {
          transactions.push({
            groupId,
            fromUser: userId,
            toUser: paidBy,
            amount: splitAmount
          });
        }
      }
      
      if (transactions.length > 0) {
        await Transaction.insertMany(transactions);
      }
    }

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses for a group
exports.getGroupExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ groupId: req.params.groupId })
                                  .populate('paidBy', 'name email')
                                  .populate('splitBetween', 'name email')
                                  .sort('-createdAt');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses involving a specific user
exports.getUserExpenses = async (req, res) => {
  try {
    // Find expenses where the user is either the payer or in the splitBetween list
    const expenses = await Expense.find({
      $or: [
        { paidBy: req.params.userId },
        { splitBetween: req.params.userId }
      ]
    }).sort('-createdAt');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
