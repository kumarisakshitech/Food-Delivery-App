import express from "express";
import auth from "../middleware/auth.js";                     // Correct middleware import
import { placeOrder, userOrders, verifyOrder } from "../controllers/orderController.js";


const router = express.Router();

// Protected Route
router.post("/placeOrder", auth, placeOrder);
router.post("/verify",verifyOrder);
router.post("/userOrders",auth,userOrders);

export default router;
