const { db } = require('../config/database');


// User data model
exports.getUserByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    console.log('Query:', query, 'email:', email);  
    const results = await db.query(query, [email]);
    console.log('Results email:', results);
    
    // Assuming 'results' contains a property like 'results'
    const rows = results || [];

    return rows[0] || null;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};

// User data model
exports.getUserByUserName = async (username) => {
  try {
    const query = 'SELECT * FROM users WHERE username = ?';
    console.log('Query:', query, 'username:', username);  
    const results = await db.query(query, [username]);
    console.log('Results username:', results);
    
    // Assuming 'results' contains a property like 'results'
    const rows = results || [];

    return rows[0] || null;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};


exports.createUser = async ({ username, email, password }) => {
  try {
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const results = await db.query(query, [username, email, password]);
    return { id: results.insertId, username, email };
  } catch (error) {
    console.log("error in createUser - " + error.message);
    if (error.parent.code === 'ER_DUP_ENTRY') {
      // Duplicate entry error handling
      throw new DuplicateKeyError('User with this username or email already exists');
    } else { 
      // Other errors
      console.log("error in createUser - " + error.message);
      throw error;
    }
  }
};
