import Cart from '../models/Cart.js';

export default class CartManager {
  async create() {
    try {
      const cart = await Cart.create({ products: [] });
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Cart.findById(id).populate('products.product');
    } catch (error) {
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await Cart.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async clearCart(id) {
    try {
      return await Cart.findByIdAndUpdate(id, { products: [] }, { new: true });
    } catch (error) {
      throw error;
    }
  }
}