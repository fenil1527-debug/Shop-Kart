import express from "express";
import { registerCustomer,loginCustomer,logoutCustomer,getMe,changePassword} from "../controllers/customer.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewar.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/logout",logoutCustomer);
router.get("/me",authMiddleware,getMe);
router.patch("/change-password",authMiddleware,changePassword);

export default router;
