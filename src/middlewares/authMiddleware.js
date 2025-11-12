const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Chưa đăng nhập hoặc thiếu token' });
    }

    // ✅ Xác thực token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          // Token hết hạn → FE sẽ tự gọi /auth/refresh nhờ interceptor
          return res.status(403).json({ message: 'Token hết hạn' });
        }
        return res.status(403).json({ message: 'Token không hợp lệ' });
      }

      // ✅ Lưu thông tin user cho route sau
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('❌ Lỗi middleware xác thực:', err);
    res.status(500).json({ message: 'Lỗi server trong xác thực' });
  }
}

module.exports = authMiddleware;
