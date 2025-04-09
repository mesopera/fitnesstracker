// database.js - Create this file in your project root
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',         // Change this to your MySQL username
  password: 'raj22550',         // Change this to your MySQL password
  database: 'fitness_app' // We'll create this database
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Initialize database - create tables if they don't exist
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        gender VARCHAR(10) NOT NULL,
        age INT NOT NULL,
        weight FLOAT,
        height FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database initialized successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
  initDatabase
};