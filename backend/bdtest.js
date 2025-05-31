const mysql = require('mysql2');
require('dotenv').config();

const isTestEnv = process.env.NODE_ENV === 'test';

const config = isTestEnv ? {
  host: process.env.DB_HOST_TEST,
  port: process.env.DB_PORT_TEST,
  user: process.env.DB_USER_TEST,
  password: process.env.DB_PASSWORD_TEST,
  database: process.env.DB_NAME_TEST,
} : {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Usar pool de conexiones
const pool = mysql.createPool({
  ...config,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

// Exportar interfaz de promesas
module.exports = pool.promise();