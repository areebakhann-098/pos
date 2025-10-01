import Product from '../model/product.model.js';
 
export const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
 
    const product = await Product.create({ name, description, price });
 
    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (err) {
    console.error(' Error creating product:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
 
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (err) {
    console.error(' Error fetching products:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
 
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
 
    if (!product) {
      return res.status(404).json({ message: ' Product not found' });
    }
 
    res.status(200).json(product);
  } catch (err) {
    console.error(' Error fetching product:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
 
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;
 
    const product = await Product.findByPk(id);
 
    if (!product) {
      return res.status(404).json({ message: ' Product not found' });
    }
 
    await product.update({ name, description, price });
 
    res.status(200).json({
      message: ' Product updated successfully',
      product,
    });
  } catch (err) {
    console.error(' Error updating product:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
 
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
 
    const product = await Product.findByPk(id);
 
    if (!product) {
      return res.status(404).json({ message: ' Product not found' });
    }
 
    await product.destroy();
 
    res.status(200).json({ message: ' Product deleted successfully' });
  } catch (err) {
    console.error(' Error deleting product:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};