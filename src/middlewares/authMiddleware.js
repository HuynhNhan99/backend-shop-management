const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.cookies.accessToken;
  
  if (!token) return res.status(401).json({ message: 'Không có token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token hết hạn' });
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;
