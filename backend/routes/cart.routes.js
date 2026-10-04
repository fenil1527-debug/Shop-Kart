import express from 'express';
import { addToCart, getCart, updateCartQuantity, removeFromCart } from '../controllers/cart.controller.js';
import { authMiddleware } from '../middlewares/auth.middlewar.js';

const router = express.Router();

// POST /cart/:productId — Add product to cart (protected)
router.post('/:productId', authMiddleware, addToCart);

// GET /cart — Get current user's cart (protected)
router.get('/', authMiddleware, getCart);

// PATCH /cart/:productId — Update quantity (protected)
router.patch('/:productId', authMiddleware, updateCartQuantity);

// DELETE /cart/:productId — Remove product from cart (protected)
router.delete('/:productId', authMiddleware, removeFromCart);

export default router;
