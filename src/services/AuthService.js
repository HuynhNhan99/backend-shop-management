const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const TokenReposiitory = require('../repositories/TokenRepository');
const TokenService = require('./TokenService');
const dotenv = require('dotenv');
dotenv.config();
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

class AuthService {
  async register(username, password, role) {
    const existing = await UserRepository.findByUsername(username);
    if (existing) throw new Error('Username đã tồn tại');

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const password_hash = await bcrypt.hash(password, salt);
    await UserRepository.createUser(username, password_hash, role);
    return { message: 'Đăng kí thành công' };
  }

  async login(username, password) {
    const user = await UserRepository.findByUsername(username);
    
    if (!user) throw new Error('Sai username');

    const match = await bcrypt.compare(password, user.password_hash);
    
    if (!match) throw new Error('Sai mật khẩu');
    
    // Tao refresToken 
    const { accessToken, refreshToken, expiresAt } = TokenService.generate(user);
    await TokenReposiitory.saveRefreshToken(user.user_id, refreshToken, expiresAt)

    return { accessToken, refreshToken, user: { user_id: user.user_id, username: user.username, role: user.role } };
  }
}

module.exports = new AuthService();
