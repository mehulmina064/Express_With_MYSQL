const { db } = require('../config/database');

// SQL Server creating a table with this configuration
// CREATE TABLE users (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   username VARCHAR(255) UNIQUE,
//   email VARCHAR(255) UNIQUE,
//   password VARCHAR(255)
// );


// User data model
exports.getUserByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const results = await db.query(query, [email]);
    console.log("results " + results)
    return results[0] || null;
  } catch (error) {
    console.log("error in getUserByEmail - " + error)
    throw error;
  }
};

// User data model
exports.getUserByUserName = async (username) => {
  try {
    const query = 'SELECT * FROM users WHERE username = ? LIMIT 1';
    const results = await db.query(query, [username]);
    console.log("results " + results)
    return results[0] || null;
  } catch (error) {
    console.log("error in getUserByUserName - " + error.message)
    throw error;
  }
};


exports.createUser = async ({ username, email, password }) => {
  try {
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const results = await db.query(query, [username, email, password]);
    return { id: results.insertId, username, email };
  } catch (error) {
    console.log("error in createUser - " + error.message)
    throw error;
  }
};
