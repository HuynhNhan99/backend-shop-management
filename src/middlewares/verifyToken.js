const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const SECRET = process.env.JWT_SECRET || 'secret_key_cua_Nhan';

function verifyToken(req, res, next) {
  const token = req.cookies.accessToken;
  
  if (!token) return res.status(401).json({ error: 'Không có token' });
 
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
}

module.exports = verifyToken;
