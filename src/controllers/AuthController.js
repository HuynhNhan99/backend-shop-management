const AuthService = require('../services/AuthService');
const TokenService = require('../services/TokenService');
const jwt = require('jsonwebtoken');

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'secret_key_cua_Nhan'

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
}
class AuthController {
    async register(req, res) {
        try {
            const { username, password, role } = req.body;
            if (!username || !password) return res.status(400).json({ error: 'username and password required' });

            const result = await AuthService.register(username, password, role);
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: 'username and password required' });
            }

            const { accessToken, refreshToken, user } = await AuthService.login(username, password);

            // ✅ Cookie option chuẩn nhất cho cross-site + iPhone Safari
            // 🧁 Refresh token: 7 ngày
            res.clearCookie('refreshToken', cookieOptions);
            res.cookie('refreshToken', refreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            });

            // Trả về user info (frontend không cần token)
            res.json({ message: "Đăng nhập thành công", accessToken, user });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) return res.status(401).json({ message: 'Không có refresh token' });

            const newAccessToken = await TokenService.refresh(refreshToken);

            // 🔥 Access token chỉ trả về cho frontend sử dụng tạm thời
            res.json({
                message: 'Token refreshed',
                accessToken: newAccessToken,
            });
        } catch (err) {
            this.logout();
            res.status(401).json({ error: err.message });
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) return res.status(401).json({ message: 'Không tìm thấy refresh token' });

            await TokenService.logout(refreshToken);

            res.clearCookie('refreshToken', cookieOptions);
            res.json({ message: 'Logged out' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async user(req, res) {
        try {
             const { refreshToken } = req.cookies;

            if (!refreshToken) return res.status(401).json({ message: 'Không có refresh token' });

            const newAccessToken = await TokenService.refresh(refreshToken);
            const user = jwt.verify(refreshToken, REFRESH_SECRET);

            // 🔥 Access token chỉ trả về cho frontend sử dụng tạm thời
            res.json({ user, accessToken: newAccessToken });
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                this.logout();
                return res.status(403).json({ error: 'Token hết hạn' });
            }
            if (err.name === 'JsonWebTokenError') {
                this.logout();
                return res.status(403).json({ error: 'Token không hợp lệ' });
            }
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
}

module.exports = new AuthController();
