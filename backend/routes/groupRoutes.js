const express = require('express');
const router = express.Router();
const { createGroup, getUserGroups, getGroupById } = require('../controllers/groupController');

router.post('/', createGroup);
router.get('/user/:userId', getUserGroups);
router.get('/:id', getGroupById);

module.exports = router;
