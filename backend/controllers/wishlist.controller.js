import mongoose from 'mongoose';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

// POST /wishlist/:productId — Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Get current user
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    if (!Array.isArray(customer.wishlist)) {
      customer.wishlist = [];
    }

    // Check for duplicate
    const alreadyWishlisted = customer.wishlist.some(
      (id) => id && id.toString() === productId
    );
    if (alreadyWishlisted) {
      return res.status(409).json({
        success: false,
        message: 'Product is already in your wishlist',
      });
    }

    // Add product to wishlist
    customer.wishlist.push(productId);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// GET /wishlist — Get current user's wishlist with populated product data
export const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name price category image stock description',
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    // Filter out nulls in case referenced products were removed
    const validWishlist = (customer.wishlist || []).filter(Boolean);

    return res.status(200).json({
      success: true,
      count: validWishlist.length,
      wishlist: validWishlist,
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// DELETE /wishlist/:productId — Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    // Get current user
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    if (!Array.isArray(customer.wishlist)) {
      customer.wishlist = [];
    }

    // Check product is in wishlist
    const index = customer.wishlist.findIndex(
      (id) => id && id.toString() === productId
    );
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist',
      });
    }

    // Remove product from wishlist
    customer.wishlist.splice(index, 1);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// PATCH /wishlist/:productId/toggle — Toggle product in wishlist (Bonus +10 Marks)
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    if (!Array.isArray(customer.wishlist)) {
      customer.wishlist = [];
    }

    const index = customer.wishlist.findIndex(
      (id) => id && id.toString() === productId
    );

    if (index > -1) {
      customer.wishlist.splice(index, 1);
      await customer.save();
      return res.status(200).json({
        success: true,
        saved: false,
        message: 'Product removed from wishlist',
      });
    } else {
      customer.wishlist.push(productId);
      await customer.save();
      return res.status(200).json({
        success: true,
        saved: true,
        message: 'Product added to wishlist',
      });
    }
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

