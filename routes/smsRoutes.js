const express = require('express');
const router = express.Router();
const { getMessage, setMessage, deleteReceiverMessages } = require('../controllers/smsController');

// এন্ডপয়েন্ট ডিফাইন করা
router.get('/get', getMessage);
router.post('/set', setMessage);
router.delete('/receiver', deleteReceiverMessages);

module.exports = router;
