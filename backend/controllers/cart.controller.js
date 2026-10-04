import mongoose from 'mongoose';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

// POST /cart/:productId — Add product to cart (or increase quantity by 1)
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (!Array.isArray(customer.cart)) customer.cart = [];

    const existingItem = customer.cart.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + 1;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot exceed available stock (${product.stock})`,
        });
      }
      existingItem.quantity = newQty;
    } else {
      if (product.stock < 1) {
        return res.status(400).json({ success: false, message: 'Product is out of stock' });
      }
      customer.cart.push({ product: productId, quantity: 1 });
    }

    await customer.save();

    await customer.populate({ path: 'cart.product', select: 'name price image stock description category' });

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: customer.cart,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /cart — Get current user's cart with populated product data
export const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price image stock description category',
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const validCart = (customer.cart || []).filter((item) => item.product);

    return res.status(200).json({
      success: true,
      cart: validCart,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PATCH /cart/:productId — Update quantity for a specific cart item
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    if (quantity === undefined || typeof quantity !== 'number' || !Number.isInteger(quantity)) {
      return res.status(400).json({ success: false, message: 'Quantity must be a whole number' });
    }

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Quantity cannot exceed available stock (${product.stock})`,
      });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const cartItem = customer.cart.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    cartItem.quantity = quantity;
    await customer.save();

    await customer.populate({ path: 'cart.product', select: 'name price image stock description category' });

    return res.status(200).json({
      success: true,
      message: 'Quantity updated',
      cart: customer.cart,
    });
  } catch (error) {
    console.error('Update cart quantity error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// DELETE /cart/:productId — Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (!Array.isArray(customer.cart)) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    const index = customer.cart.findIndex(
      (item) => item.product && item.product.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    customer.cart.splice(index, 1);
    await customer.save();

    await customer.populate({ path: 'cart.product', select: 'name price image stock description category' });

    return res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart: customer.cart,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
