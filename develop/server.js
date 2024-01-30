// Import required modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3001, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the MySQL server and SQL database
connection.connect(function(err) {
  if (err) throw err;
  // Start your server or run your functions here
});