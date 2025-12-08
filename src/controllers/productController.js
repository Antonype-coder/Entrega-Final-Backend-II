import ProductRepository from '../repositories/ProductRepository.js';

const productRepository = new ProductRepository();

export const getProducts = async (req, res) => {
  try {
    const products = await productRepository.findAll();
    res.json({
      message: 'Productos obtenidos',
      products
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, code } = req.body;

    if (!title || !price || !stock) {
      return res.status(400).json({ 
        message: 'Título, precio y stock son requeridos' 
      });
    }

    const product = await productRepository.create({
      title,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      code
    });

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El código del producto ya existe' });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await productRepository.update(id, updateData);
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productRepository.delete(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};