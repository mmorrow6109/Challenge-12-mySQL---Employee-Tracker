// Import required modules
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3001,
  user: 'mmorrow6109',
  password: 'mySQLTweezer6109!',
  database: 'employees_db'
});

