const mysql = require('mysql2');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
  // For Railway deployment - use DATABASE_URL directly
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  });
} else {
  // For local development
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  });
}

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release(); // Release the connection back to pool
});

// Use promise-based queries for better error handling
const db = pool.promise();

module.exports = db;