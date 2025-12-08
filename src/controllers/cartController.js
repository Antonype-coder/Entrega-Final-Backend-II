import CartService from '../services/cartService.js';

const cartService = new CartService();

export const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart();
    
    res.status(201).json({
      message: 'Carrito creado exitosamente',
      cart
    });
  } catch (error) {
    console.error('Error creando carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    
    const cart = await cartService.getCart(cid);
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.json({
      message: 'Carrito obtenido',
      cart
    });
  } catch (error) {
    console.error('Error obteniendo carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await cartService.addProductToCart(cid, pid, parseInt(quantity));
    
    res.json({
      message: 'Producto agregado al carrito',
      cart
    });
  } catch (error) {
    console.error('Error agregando producto:', error);
    if (error.message === 'Carrito o producto no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const userEmail = req.user.email;

    const result = await cartService.purchaseCart(cid, userEmail);
    
    res.json({
      message: 'Compra procesada exitosamente',
      result
    });
  } catch (error) {
    console.error('Error procesando compra:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};