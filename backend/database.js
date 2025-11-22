const mysql = require("mysql");
const { promisify } = require("util");

// Create MySQL connection pool for the MBA database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "mba", // Only keeping the MBA database
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
  charset: "utf8mb4",
});

// Handle connection events for pool
pool.on("connection", (connection) => {
  console.log("MySQL connection (MBA) established with ID:", connection.threadId);
});

pool.on("error", (err) => handleMysqlError(err, "MBA"));

// Function to handle MySQL errors
function handleMysqlError(err, dbName) {
  console.error(`MySQL connection error in ${dbName}:`, err.code);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error(`${dbName} connection was closed.`);
  } else if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error(`${dbName} has too many connections.`);
  } else if (err.code === 'ECONNREFUSED') {
    console.error(`${dbName} connection was refused.`);
  } else {
    console.error(`Unknown MySQL error in ${dbName}:`, err);
  }
}

// Create a promisified query function for the MBA database
const query = promisify(pool.query).bind(pool);

// Function to test database connection
async function testConnection() {
  try {
    await query("SELECT 1");
    console.log("Database (MBA) connection successful.");
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
  }
}

// Call the test function
testConnection();

// Export connection pool and query function
module.exports = {
  pool,
  query,
};
