const ProductService = require('../services/ProductService');

class ProductController {
  async list(req, res) {
    try {
      const rows = await ProductService.list();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      // allow only admin to create
      if (req.user.role !== 'admin') return res.status(403).json({ error: 'No permission' });

      const id = await ProductService.create(req.body);
      res.json({ message: 'Created', id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async remove(req, res) {
    try {
      if (req.user.role !== 'admin') return res.status(403).json({ error: 'No permission' });
      const id = req.params.id;
      await ProductService.remove(id);
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ProductController();
