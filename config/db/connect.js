const mysql = require("mysql2/promise");
const { configurations } = require("../config/config");

const database = configurations.Database;

// A single shared pool is preferable to opening one connection per request.
const pool = mysql.createPool({
  host: process.env.DB_HOST || database.host,
  port: Number(process.env.DB_PORT || database.port || 3306),
  user: process.env.DB_USER || database.username,
  password: process.env.DB_PASSWORD || database.password,
  database: process.env.DB_NAME || database.databaseName,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || configurations.dbPoolSize || 10),
  queueLimit: 0,
  charset: "utf8mb4",
});

async function testConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

module.exports = { pool, testConnection };
