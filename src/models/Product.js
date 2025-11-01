class Product {
    constructor({ product_code, product_name, category, cost_price, sale_price, quantity_in_stock }) {
      this.product_code = product_code;
      this.product_name = product_name;
      this.category = category;
      this.cost_price = cost_price;
      this.sale_price = sale_price;
      this.quantity_in_stock = quantity_in_stock;
    }
  }
  module.exports = Product;
  