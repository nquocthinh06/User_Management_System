const mysql = require('mysql2/promise');

let pool;

// Database configuration - supports both Docker and local environment
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'quocthinh@1245',
    database: process.env.DB_NAME || 'user_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const connectDB = async () => {
    try {
        pool = mysql.createPool(dbConfig);

        // Test connection
        const connection = await pool.getConnection();
        console.log(`MySQL Connected: ${dbConfig.host}:${dbConfig.port}`);
        connection.release();

        // Tạo bảng users nếu chưa có
        await createUsersTable();
    } catch (error) {
        console.error(`MySQL Error: ${error.message}`);
        process.exit(1);
    }
};

const createUsersTable = async () => {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            avatar VARCHAR(500) DEFAULT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    try {
        await pool.execute(createTableSQL);
        console.log('Users table ready');
    } catch (error) {
        console.error('Error creating users table:', error.message);
    }
};

const getPool = () => pool;

module.exports = { connectDB, getPool };
