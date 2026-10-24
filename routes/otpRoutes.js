const express = require('express');
const router = express.Router();
const { getOtp, setOtp, deleteReceiverOtps } = require('../controllers/otpController.js');

// এন্ডপয়েন্ট ডিফাইন করা
router.get('/get', getOtp);
router.post('/set', setOtp);
router.delete('/receiver', deleteReceiverOtps);

module.exports = router;
