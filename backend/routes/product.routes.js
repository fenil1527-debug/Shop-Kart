import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
} from '../controllers/product.controller.js';

const router = express.Router();

// POST /products — Create a product (no auth per lab spec)
router.post('/', createProduct);

// GET /products — List all products (supports ?search, ?category, ?sort)
router.get('/', getAllProducts);

// GET /products/:id — Get single product
router.get('/:id', getProductById);

export default router;
