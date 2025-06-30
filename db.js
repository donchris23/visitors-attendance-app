require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'turntable.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ACIWmPfhAdIdiZjlSDaaLCMBZDbRCksA',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 34817
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('MySQL Connected');
});

module.exports = db;

const connection = mysql.createConnection({
  host: 'turntable.proxy.rlwy.net',
  user: 'root',
  password: 'ACIWmPfhAdIdiZjlSDaaLCMBZDbRCksA',
  database: 'railway',
  port: 34817,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to Railway MySQL database');
});

module.exports = connection;
