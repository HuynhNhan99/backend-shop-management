const PurchaseRepository = require('../repositories/PurchaseRepository');
const ProductRepository = require('../repositories/ProductRepository');

class PurchaseService {
  async createPurchase(supplier_name, items) {
    if (!items || items.length === 0) throw new Error('Items required');
    const total = items.reduce((s, it) => s + it.quantity * it.unit_cost, 0);

    const orderId = await PurchaseRepository.createOrder(supplier_name, total);

    const values = items.map(i => [orderId, i.product_id, i.quantity, i.unit_cost]);
    await PurchaseRepository.insertItems(values);

    // update product stocks
    for (const it of items) {
      await ProductRepository.updateStock(it.product_id, it.quantity);
    }

    return { orderId, total };
  }

  async list() {
    return PurchaseRepository.listAll();
  }
}

module.exports = new PurchaseService();
