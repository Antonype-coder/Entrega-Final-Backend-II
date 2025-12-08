import ProductManager from '../dao/managers/ProductManager.js';

const productManager = new ProductManager();

export default class ProductRepository {
  async create(productData) {
    return await productManager.create(productData);
  }

  async findAll() {
    return await productManager.findAll();
  }

  async findById(id) {
    return await productManager.findById(id);
  }

  async update(id, updateData) {
    return await productManager.update(id, updateData);
  }

  async delete(id) {
    return await productManager.delete(id);
  }
}