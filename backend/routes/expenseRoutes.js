const express = require('express');
const router = express.Router();
const { addExpense, getGroupExpenses, getUserExpenses } = require('../controllers/expenseController');

router.post('/', addExpense);
router.get('/user/:userId', getUserExpenses);
router.get('/:groupId', getGroupExpenses);

module.exports = router;
