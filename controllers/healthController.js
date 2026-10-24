const sequelize = require('../config/database');

const getHealth = async (req, res) => {
  try {
    await sequelize.authenticate();

    return res.status(200).json({
      status: 'ok',
      checks: {
        server: 'ok',
        database: 'ok'
      }
    });
  } catch (error) {
    // Do not expose database errors, connection details, or credentials publicly.
    return res.status(503).json({
      status: 'error',
      checks: {
        server: 'ok',
        database: 'error'
      }
    });
  }
};

module.exports = { getHealth };
