class ProductService {
  constructor({ productRepo }) {
    this.productRepo = productRepo;
  }

  async createProduct({ name, price, stock }) {
    if (price <= 0 || stock < 0) {
      throw new Error('Invalid product values');
    }

    return this.productRepo.create({ name, price, stock });
  }
}

module.exports = ProductService;
