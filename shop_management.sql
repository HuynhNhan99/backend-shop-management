-- =====================================================
-- 📦 DATABASE: QUẢN LÝ BÁN HÀNG & KHO
-- Tác giả: Nhàn 💕
-- Ngày tạo: 2025-10-05
-- =====================================================

-- 1️⃣ Tạo database (nếu chưa có)
CREATE DATABASE IF NOT EXISTS shop_management
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE shop_management;

-- =====================================================
-- 2️⃣ BẢNG: products (Sản phẩm)
-- =====================================================
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(50) UNIQUE,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    cost_price DECIMAL(10,2) DEFAULT 0,
    sale_price DECIMAL(10,2) DEFAULT 0,
    quantity_in_stock INT DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'cái',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 3️⃣ BẢNG: import_receipts (Phiếu nhập hàng)
-- =====================================================
CREATE TABLE import_receipts (
    import_id INT AUTO_INCREMENT PRIMARY KEY,
    import_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    supplier_name VARCHAR(100),
    total_amount DECIMAL(12,2) DEFAULT 0,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4️⃣ BẢNG: import_details (Chi tiết phiếu nhập)
-- =====================================================
CREATE TABLE import_details (
    import_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    import_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 0,
    unit_cost DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    FOREIGN KEY (import_id) REFERENCES import_receipts(import_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- =====================================================
-- 5️⃣ BẢNG: customers (Khách hàng)
-- =====================================================
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    address VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6️⃣ BẢNG: orders (Đơn hàng bán)
-- =====================================================
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    customer_id INT NULL,
    total_amount DECIMAL(12,2) DEFAULT 0,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL
);

-- =====================================================
-- 7️⃣ BẢNG: order_details (Chi tiết đơn hàng)
-- =====================================================
CREATE TABLE order_details (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 0,
    unit_price DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- =====================================================
-- 8️⃣ BẢNG: inventory_log (Nhật ký kho)
-- =====================================================
CREATE TABLE inventory_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    change_type ENUM('import','sale','adjust') NOT NULL,
    quantity_change INT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reference_id INT,
    note TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- =====================================================
-- 9️⃣ DỮ LIỆU MẪU (test ban đầu)
-- =====================================================

INSERT INTO products (product_code, product_name, category, cost_price, sale_price, quantity_in_stock)
VALUES
('SP001', 'Sữa bột Abbott Grow 3', 'Sữa', 250000, 320000, 20),
('SP002', 'Tã Moony M58', 'Tã bỉm', 300000, 360000, 50),
('SP003', 'Khăn ướt Bobby', 'Đồ dùng', 15000, 22000, 100);

INSERT INTO customers (name, phone, address)
VALUES
('Nguyễn Văn A', '0901234567', 'Quận 1, TP.HCM'),
('Trần Thị B', '0909876543', 'Quận Bình Thạnh, TP.HCM');



CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('admin', 'staff') DEFAULT 'staff',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo sẵn 1 tài khoản admin mẫu
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2b$10$z6/0Qdsvpl4S6q6bP0UbGOCzt4vD5nQmM4m4Dbl.4QGdsikPK9aQu', 'admin');

-- =====================================================
-- ✅ KẾT THÚC FILE
-- =====================================================

