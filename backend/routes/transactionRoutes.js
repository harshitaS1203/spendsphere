const express = require('express');
const router = express.Router();
const { getUserTransactions, settleTransaction, settleBetween } = require('../controllers/transactionController');

router.get('/:userId', getUserTransactions);
router.put('/:id/settle', settleTransaction);
router.post('/settle-between', settleBetween);

module.exports = router;
