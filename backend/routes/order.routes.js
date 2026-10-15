import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewar.js";

const router = express.Router();

router.post("/create-payment-order", authMiddleware, createPaymentOrder);

router.post("/verify-payment", authMiddleware, verifyPayment);

router.get("/", authMiddleware, getUserOrders);

router.get("/:id", authMiddleware, getOrderById);

router.patch("/:id/status", authMiddleware, updateOrderStatus);

export default router;
