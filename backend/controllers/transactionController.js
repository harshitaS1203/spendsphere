const Transaction = require('../models/Transaction');

// Get transaction history for a user
exports.getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all transactions where user is involved (either owes or gets paid)
    const transactions = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }]
    })
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email')
    .populate('groupId', 'name')
    .sort('-createdAt');
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Settle a transaction
exports.settleTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (transaction) {
      transaction.isSettled = true;
      const updatedTransaction = await transaction.save();
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Settle all transactions between two users in a group
exports.settleBetween = async (req, res) => {
  try {
    const { groupId, user1Id, user2Id } = req.body;
    
    const result = await Transaction.updateMany(
      {
        groupId: groupId,
        isSettled: false,
        $or: [
          { fromUser: user1Id, toUser: user2Id },
          { fromUser: user2Id, toUser: user1Id }
        ]
      },
      { $set: { isSettled: true } }
    );
    
    res.json({ message: 'Settled successfully', modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
