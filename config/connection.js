// Import required modules
const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false, // disable logging
  }
);

module.exports = sequelize;
