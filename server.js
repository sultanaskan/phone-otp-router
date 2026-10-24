const express = require('express');
const sequelize = require('./config/database');
const smsRoutes = require('./routes/smsRoutes');
const healthRoutes = require('./routes/healthRoutes');
const { startMessageCleanup } = require('./services/messageCleanup');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/health', healthRoutes);
// রুটিং
app.use('/sms', smsRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Remote MySQL Database connected successfully.');
    return sequelize.sync(); 
  })
  .then(() => {
    startMessageCleanup();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
