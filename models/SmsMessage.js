const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SmsMessage = sequelize.define('SmsMessage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  receiver: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  // Keep the current table so existing stored messages remain available.
  tableName: 'Otps'
});

module.exports = SmsMessage;
