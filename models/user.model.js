const query = require('../config/database');
const { multipleColumnSet } = require('../utils/common.utils');
const { DuplicateKeyError } = require('../utils/errors');
const Role = require('../utils/userRoles.utils');
class UserModel {
    tableName = 'users';

    find = async (params = {}) => {
        try {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql); 
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    } catch (error) {
        console.log('Error:', error);
        throw error;
      }
    }

    findOne = async (params) => {
        try{
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    } catch (error) {
        console.log('Error:', error);
        throw error;
      }
    }

    create = async ({ username, password, first_name, last_name, email, role = Role.SuperUser, age = 0 }) => {
        try {
        const sql = `INSERT INTO ${this.tableName}
        (username, password, first_name, last_name, email, role, age) VALUES (?,?,?,?,?,?,?)`;

        const result = await query(sql, [username, password, first_name, last_name, email, role, age]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    } catch (error) {
        console.log("error in createUser - " + error.message);
        if (error.code === 'ER_DUP_ENTRY') {
          // Duplicate entry error handling
          throw new DuplicateKeyError('User with this username or email already exists');
        } else { 
          // Other errors
          console.log("error in createUser - " + error.message);
          throw error;
        }
      }
    }

    update = async (params, id) => {
        try{
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE user SET ${columnSet} WHERE id = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    } catch (error) {
        console.log('Error:', error);
        throw error;
      }
    }

    delete = async (id) => {
        try{
        const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    } catch (error) {
        console.log('Error:', error);
        throw error;
      }
    }

}

module.exports = new UserModel;