const SmsMessage = require('../models/SmsMessage');
const { Op } = require("sequelize");
const { MESSAGE_RETENTION_MS } = require('../config/messageRetention');

const getMessage = async (req, res) => {
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
    let messageRecord = null;

    // Substring matching condition
    const whereCondition = {
      sender: { [Op.like]: `%${sender}%` },
      receiver: { [Op.like]: `%${receiver}%` }
    };

    while (Date.now() - startTime < timeout) {
      const expiresAfter = new Date(Date.now() - MESSAGE_RETENTION_MS);
      messageRecord = await SmsMessage.findOne({
        where: {
          ...whereCondition,
          createdAt: { [Op.gte]: expiresAfter }
        },
        order: [['createdAt', 'DESC']]
      });

      if (messageRecord) { break; }

      await new Promise(resolve => setTimeout(resolve, interval));
    }

    if (!messageRecord) {
      return res.status(404).json({ error: "No message found within 30 seconds" });
    }

    // matched record মুছে ফেলার কন্ডিশন
    await SmsMessage.destroy({
      where: whereCondition
    });

    res.status(200).json({
      sender: messageRecord.sender,
      receiver: messageRecord.receiver,
      message: messageRecord.message,
      createdAt: messageRecord.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// POST /sms/set
const setMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: "Sender, receiver, and message are required" });
    }

    const newMessage = await SmsMessage.create({ sender, receiver, message });

    res.status(201).json({
      success: true,
      message: "Message saved successfully",
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReceiverMessages = async (req, res) => {
  try {
    const { receiver } = req.query;
    if (typeof receiver !== 'string' || !receiver.trim()) {
      return res.status(400).json({ error: 'Receiver is required' });
    }

    const deletedCount = await SmsMessage.destroy({ where: { receiver } });
    return res.status(200).json({ success: true, receiver, deletedCount });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to delete receiver messages' });
  }
};

module.exports = {
  getMessage,
  setMessage,
  deleteReceiverMessages
};
