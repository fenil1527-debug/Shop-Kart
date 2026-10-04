import express from 'express';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist,
} from '../controllers/wishlist.controller.js';
import { authMiddleware } from '../middlewares/auth.middlewar.js';

const router = express.Router();

// POST /wishlist/:productId — Add product to wishlist (protected)
router.post('/:productId', authMiddleware, addToWishlist);

// GET /wishlist — Get current user's wishlist (protected)
router.get('/', authMiddleware, getWishlist);

// DELETE /wishlist/:productId — Remove product from wishlist (protected)
router.delete('/:productId', authMiddleware, removeFromWishlist);

// PATCH /wishlist/:productId/toggle — Toggle product in wishlist (Bonus, protected)
router.patch('/:productId/toggle', authMiddleware, toggleWishlist);

export default router;
