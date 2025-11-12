const TokenRepository = require('../repositories/TokenRepository');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'secret_key_cua_Nhan';
const JWT_EXPIRES_REFRESS = process.env.JWT_EXPIRES_REFRESS || '7d';
const JWT_EXPIRES_ACCESS = process.env.JWT_EXPIRES_ACCESS || '15m';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'secret_key_cua_Nhan'

class TokenService {
  generate(user) {
    const accessToken = jwt.sign({ user_id: user.user_id, username: user.username, role: user.role }, SECRET, { expiresIn: JWT_EXPIRES_ACCESS });
    const refreshToken = jwt.sign({ user_id: user.user_id, username: user.username, role: user.role }, REFRESH_SECRET, { expiresIn: JWT_EXPIRES_REFRESS });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return { accessToken, refreshToken, expiresAt }
  }

  async refresh(oldRefreshToken) {
    const found = await TokenRepository.findRefreshToken(oldRefreshToken);
    
    if (!found) throw new Error('Refresh token không hợp lệ')
  
    const user = jwt.verify(oldRefreshToken, REFRESH_SECRET)
    const newAccessToken = jwt.sign({ user_id: user.user_id, username: user.username, role: user.role }, SECRET, { expiresIn: JWT_EXPIRES_ACCESS })
   
    return newAccessToken
  }

async logout(token) {
    await TokenRepository.deleteRefreshToken(token)
  }

  verify(token) {
    return jwt.verify(token, SECRET);
  }
}

module.exports = new TokenService();
