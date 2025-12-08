import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import TicketRepository from '../repositories/TicketRepository.js';

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();

export default class CartService {
  async createCart() {
    return await cartRepository.create();
  }

  async getCart(cartId) {
    return await cartRepository.findById(cartId);
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await cartRepository.findById(cartId);
    const product = await productRepository.findById(productId);
    
    if (!cart || !product) {
      throw new Error('Carrito o producto no encontrado');
    }

    const existingProduct = cart.products.find(
      item => item.product._id.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return await cartRepository.update(cartId, cart);
  }

  async purchaseCart(cartId, userEmail) {
    const cart = await cartRepository.findById(cartId);
    
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    let totalAmount = 0;
    const purchasedProducts = [];
    const failedProducts = [];

    for (const item of cart.products) {
      const product = item.product;
      
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await productRepository.update(product._id, { stock: product.stock });
        
        totalAmount += product.price * item.quantity;
        purchasedProducts.push(item);
      } else {
        failedProducts.push(item);
      }
    }

    let ticket = null;
    if (totalAmount > 0) {
      ticket = await ticketRepository.create({
        amount: totalAmount,
        purchaser: userEmail
      });
    }

    await cartRepository.update(cartId, { products: failedProducts });

    return {
      ticket,
      purchasedProducts,
      failedProducts,
      totalAmount
    };
  }
}