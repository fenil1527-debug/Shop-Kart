import express from 'express';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist,
} from '../controllers/wishlist.controller.js';
import { authMiddleware } from '../middlewares/auth.middlewar.js';

const router = express.Router();

router.post('/:productId', authMiddleware, addToWishlist);

router.get('/', authMiddleware, getWishlist);

router.delete('/:productId', authMiddleware, removeFromWishlist);

router.patch('/:productId/toggle', authMiddleware, toggleWishlist);

export default router;
