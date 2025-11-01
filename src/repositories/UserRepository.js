const db = require('../config/db');

class UserRepository {
  async createUser(username, password_hash, role = 'staff') {
    const [res] = await db.query(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, password_hash, role]
    );
    return { insertId: res.insertId };
  }

  async findByUsername(username) {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  async findById(userId) {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return rows[0];
  }
}

module.exports = new UserRepository();
