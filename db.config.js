const { Pool } = require('pg');
require('dotenv').config();

// Check if environment is set to 'neon'
const isNeon = process.env.DB_ENV === 'neon'; 
console.log('isNeon', isNeon);

// Define pool configuration
const pool = new Pool(
  isNeon ? {
    connectionString: process.env.DATABASE_URL,  // For Neon, use the DATABASE_URL
    ssl: { rejectUnauthorized: false },  // SSL for Neon
  } : {
    user: process.env.LOCAL_DB_USER,      // For local, use local database credentials
    host: process.env.LOCAL_DB_HOST,
    database: process.env.LOCAL_DB_DATABASE,
    password: process.env.LOCAL_DB_PASSWORD,
    port: process.env.LOCAL_DB_PORT,
  }
);

module.exports = { pool };
