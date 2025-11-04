const AuthService = require('../services/AuthService');
const TokenService = require('../services/TokenService');
const UserRepository = require('../repositories/UserRepository');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret_key_cua_Nhan';

class AuthController {
  async register(req, res) {
    try {
      const { username, password, role } = req.body;
      if (!username || !password)
        return res.status(400).json({ error: 'username and password required' });

      const result = await AuthService.register(username, password, role);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password)
        return res.status(400).json({ error: 'username and password required' });

      const { accessToken, refreshToken, user } = await AuthService.login(username, password);

      // 🟢 Cookie option chuẩn nhất cho iPhone/Safari
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true khi deploy HTTPS (Render)
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // bắt buộc 'none' cho cross-site
        path: '/',
      };

      // ⚡ Access token (15 phút)
      res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });

      // ⚡ Refresh token (7 ngày)
      res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // ⚡ Để iPhone lưu cookie chắc chắn, thêm header CORS cookie echo
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);

      res.json({ message: 'Login successful', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

      const newAccess = await TokenService.refresh(refreshToken);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      };

      res.cookie('accessToken', newAccess, cookieOptions);
      res.json({ message: 'Token refreshed', accessToken: newAccess });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      if (refreshToken) await TokenService.logout(refreshToken);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
      };

      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);

      res.json({ message: 'Logged out' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async user(req, res) {
    try {
      const token = req.cookies?.accessToken;
      if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });

      const decoded = jwt.verify(token, SECRET);
      const user = await UserRepository.findById(decoded.user_id);

      res.status(200).json({ user });
    } catch (err) {
      console.error('❌ Lỗi xác thực token:', err.message);

      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Token hết hạn' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ error: 'Token không hợp lệ' });
      }
      res.status(500).json({ error: 'Lỗi server' });
    }
  }
}

module.exports = new AuthController();
