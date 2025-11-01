const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shop_management',
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: process.env.DB_CA ? Buffer.from(process.env.DB_CA, 'base64').toString('utf-8') : fs.readFileSync('./src/config/ca.pem'), // đường dẫn tới file CA bạn vừa tải
  },
});

module.exports = pool;
