const express = require('express');
const sequelize = require('./config/database');
const otpRoutes = require('./routes/otpRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// রুটিং
app.use('/otp', otpRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Remote MySQL Database connected successfully.');
    return sequelize.sync(); 
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });