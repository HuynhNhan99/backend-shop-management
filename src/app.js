const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

// 🧠 Cho phép cả local và vercel frontend
const allowedOrigins = [
  'http://localhost:5173',
  FRONTEND_URL,
];

// ✅ Cấu hình CORS an toàn và linh hoạt
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // cho phép cookie
}));

// ✅ OPTIONS preflight cho toàn bộ domain hợp lệ
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// 🧩 Middleware cần thiết
app.use(cookieParser());               // ⚠️ Đọc cookie từ request
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// 🧭 Routes
app.use('/auth', authRoutes);
app.use('/api', authMiddleware);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);

app.get('/', (req, res) => res.send('Shop backend (SOLID) running 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server listening on http://localhost:${PORT}`));
