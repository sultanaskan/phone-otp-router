const Otp = require('../models/Otp');

// GET /otp/get?phone=XXXXX
const getOtp = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    if (!sender) {
      return res.status(400).json({ error: "Sender is required" });
    }
    if (!receiver) {
      return res.status(400).json({ error: "Receiver is required" });
    }

    const timeout = 30000;
    const interval = 2000; 
    const startTime = Date.now();
    let otpRecord = null;

    while (Date.now() - startTime < timeout) {
      otpRecord = await Otp.findOne({
      where: { sender, receiver },
        order: [['createdAt', 'DESC']]
      });

      if (otpRecord) {break;}

      await new Promise(resolve => setTimeout(resolve, interval));
    }

    if (!otpRecord) {return res.status(404).json({ error: "No OTP found within 30 seconds" });}
    await Otp.destroy({ where: {sender, receiver}});

    if (!otpRecord) {return res.status(404).json({ error: "No OTP found for this phone number" });}

    res.status(200).json({
      sender: otpRecord.sender,
      receiver: otpRecord.receiver,
      message: otpRecord.message,
      createdAt: otpRecord.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /otp/set
const setOtp = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: "Both phone and otp are required" });
    }

    // ডাটাবেসে নতুন OTP সেভ করা
    const newOtp = await Otp.create({ sender, receiver, message });

    res.status(201).json({
      success: true,
      message: "OTP saved to database successfully",
      data: newOtp
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOtp,
  setOtp
};