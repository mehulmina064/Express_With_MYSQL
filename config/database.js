require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME_MAIN,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = {
  db: db, // Export the MySQL connection
  jwtSecret: process.env.JWT_SECRET,
  mongodb: {
    uri: process.env.MONGO_DB_URI,
    database: process.env.MONGO_DB_NAME_MAIN,
  },
};
