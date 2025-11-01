CREATE DATABASE IF NOT EXISTS shop_management
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shop_management;

-- products
CREATE TABLE IF NOT EXISTS products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_code VARCHAR(50) UNIQUE,
  product_name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  cost_price DECIMAL(12,2) DEFAULT 0,
  sale_price DECIMAL(12,2) DEFAULT 0,
  quantity_in_stock INT DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'cai',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- users
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('admin','staff') DEFAULT 'staff',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- user tokens
CREATE TABLE IF NOT EXISTS  user_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- purchase orders
CREATE TABLE IF NOT EXISTS purchase_orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_name VARCHAR(200),
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(14,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  unit_cost DECIMAL(12,2),
  FOREIGN KEY (order_id) REFERENCES purchase_orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
);

-- Insert sample admin (password: 123456) hashed with bcrypt
-- If you want to keep the example hash below, use it; else create users via API register.
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2b$10$CkkwHG.u.Pyb3fDKGzotPessEsIxdZzcllfscflzzxyiY.vZm83q6', 'admin')
ON DUPLICATE KEY UPDATE username = username;
