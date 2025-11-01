const PurchaseService = require('../services/PurchaseService');

class PurchaseController {
  async list(req, res) {
    try {
      const rows = await PurchaseService.list();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({ error: 'No permission' });
      }
      const { supplier_name, items } = req.body;
      const result = await PurchaseService.createPurchase(supplier_name, items);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new PurchaseController();
