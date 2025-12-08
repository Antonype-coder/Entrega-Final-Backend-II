import Product from '../models/Product.js';

export default class ProductManager {
  async create(productData) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await Product.find();
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await Product.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}