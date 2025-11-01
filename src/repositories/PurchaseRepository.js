const db = require('../config/db');

class PurchaseRepository {
  async createOrder(supplier_name, total_amount) {
    const [res] = await db.query(
      'INSERT INTO purchase_orders (supplier_name, total_amount) VALUES (?, ?)',
      [supplier_name, total_amount]
    );
    return res.insertId;
  }

  async insertItems(items) {
    // items: [ [orderId, productId, quantity, unit_cost], ... ]
    await db.query(
      'INSERT INTO purchase_order_items (order_id, product_id, quantity, unit_cost) VALUES ?',
      [items]
    );
  }

  async listAll() {
    const [rows] = await db.query(`
      SELECT po.*, COUNT(poi.item_id) AS total_items
      FROM purchase_orders po
      LEFT JOIN purchase_order_items poi ON po.order_id = poi.order_id
      GROUP BY po.order_id
      ORDER BY po.order_id DESC
    `);
    return rows;
  }
}

module.exports = new PurchaseRepository();
