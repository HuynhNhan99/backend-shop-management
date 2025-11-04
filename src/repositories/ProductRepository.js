const db = require('../config/db');
const Product = require('../models/Product');

class ProductRepository {
  async findAll() {
    const [rows] = await db.query('SELECT * FROM products ORDER BY product_id DESC');
    return rows;
  }

  async create(productData) {
    const product = new Product(productData);
    const [res] = await db.query(
      `INSERT INTO products
       (product_code, product_name, category, cost_price, sale_price, quantity_in_stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
       [
        product.product_code,
        product.product_name,
        product.category,
        product.cost_price || 0,
        product.sale_price || 0,
        product.quantity_in_stock || 0
      ]
    );
    return res.insertId;
  }

  async updateById(id, productData) {
    const product = new Product(productData);
    const [res] = await db.query(
      `UPDATE products 
       SET product_code = ?, product_name = ?, category = ?, 
           cost_price = ?, sale_price = ?, quantity_in_stock = ? 
       WHERE product_id = ?`,
      [
        product.product_code,
        product.product_name,
        product.category,
        product.cost_price || 0,
        product.sale_price || 0,
        product.quantity_in_stock || 0,
        id,
      ]
    );
    return res.affectedRows > 0;
  }

  async deleteById(id) {
    await db.query('DELETE FROM products WHERE product_id = ?', [id]);
  }

  async updateStock(productId, productData) {
    const product = new Product({ productId, ...productData });
    await db.query('UPDATE products SET quantity_in_stock = quantity_in_stock + ? WHERE product_id = ?', 
      [
        product.product_code,
        product.product_name,
        product.category,
        product.cost_price || 0,
        product.sale_price || 0,
        product.quantity_in_stock || 0,
        id
      ]
    );
  }
}

module.exports = new ProductRepository();
