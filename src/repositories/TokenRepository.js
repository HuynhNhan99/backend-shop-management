const db = require('../config/db');

class TokenRepository {
    async saveRefreshToken(userId, token, expiresAt) {
      await db.query(
        'INSERT INTO user_tokens (user_id, refresh_token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiresAt]
      );
    }
  
    async findRefreshToken(token) {
        const [rows] = await db.query('SELECT * FROM user_tokens WHERE refresh_token = ?', [token])
        return rows[0]
    }

    async deleteRefreshToken(token) {
        await db.query('DELETE FROM user_tokens WHERE refresh_token = ?', [token])
    }
  }
  
  module.exports = new TokenRepository();