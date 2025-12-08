import CartManager from '../dao/managers/CartManager.js';

const cartManager = new CartManager();

export default class CartRepository {
  async create() {
    return await cartManager.create();
  }

  async findById(id) {
    return await cartManager.findById(id);
  }

  async update(id, updateData) {
    return await cartManager.update(id, updateData);
  }

  async clearCart(id) {
    return await cartManager.clearCart(id);
  }
}