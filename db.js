// require('dotenv').config();
// const mysql = require('mysql2');

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || 'metro.proxy.rlwy.net',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'sIQqQeXGpMnCjulennZMruyDOvLvfsIh',
//   database: process.env.DB_NAME || 'railway',
//   port: process.env.DB_PORT || 24535
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     throw err;
//   }
//   console.log('MySQL Connected');
// });

// module.exports = db;

// const connection = mysql.createConnection({
//   host: 'metro.proxy.rlwy.net',
//   user: 'root',
//   password: 'sIQqQeXGpMnCjulennZMruyDOvLvfsIh',
//   database: 'railway',
//   port: 24535,
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     throw err;
//   }
//   console.log('Connected to Railway MySQL database');
// });

// module.exports = connection;

require('dotenv').config();
const mysql = require('mysql2');

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

// Create a MySQL connection pool with promise support
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'metro.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'sIQqQeXGpMnCjulennZMruyDOvLvfsIh',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 24535,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10 seconds
});

// Export the promise pool so you can use async/await in other files
module.exports = pool.promise();
