const ProductRepository = require('../repositories/ProductRepository');

class ProductService {
  async list() {
    return ProductRepository.findAll();
  }

  async create(data) {
    return ProductRepository.create(data);
  }

  async remove(id) {
    return ProductRepository.deleteById(id);
  }

  async increaseStock(productId, qty) {
    return ProductRepository.updateStock(productId, qty);
  }
}

module.exports = new ProductService();
