// Import required modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  process.env.DB_NAME,
  {
    host: 'localhost',
    port: 3001, 
    dialect: 'mysql'
 }
);

module.exports = sequelize;