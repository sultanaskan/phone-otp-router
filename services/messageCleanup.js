const { Op } = require('sequelize');
const SmsMessage = require('../models/SmsMessage');
const { MESSAGE_RETENTION_MS, CLEANUP_INTERVAL_MS } = require('../config/messageRetention');

const deleteExpiredMessages = async () => {
  const expiresBefore = new Date(Date.now() - MESSAGE_RETENTION_MS);
  return SmsMessage.destroy({
    where: {
      createdAt: { [Op.lt]: expiresBefore }
    }
  });
};

const startMessageCleanup = () => {
  const runCleanup = async () => {
    try {
      await deleteExpiredMessages();
    } catch (error) {
      // Keep message contents and database connection details out of logs.
      console.error('Message retention cleanup failed.');
    }
  };

  void runCleanup();
  const cleanupTimer = setInterval(runCleanup, CLEANUP_INTERVAL_MS);
  cleanupTimer.unref();
  return cleanupTimer;
};

module.exports = { startMessageCleanup };
