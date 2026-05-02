const Transaction = require('../models/Transaction');

exports.getReminders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all unsettled transactions involving the user
    const transactions = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
      isSettled: false
    })
    .populate('fromUser', 'name')
    .populate('toUser', 'name');

    const reminders = transactions.map(t => {
      // If user is fromUser (they owe money)
      if (t.fromUser._id.toString() === userId) {
        return `You owe ₹${t.amount.toFixed(2)} to ${t.toUser.name}`;
      } 
      // If user is toUser (they are owed money)
      else {
        return `${t.fromUser.name} owes you ₹${t.amount.toFixed(2)}`;
      }
    });

    res.json({ reminders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
