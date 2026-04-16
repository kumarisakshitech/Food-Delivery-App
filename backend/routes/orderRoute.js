import express from "express";
import auth from "../middleware/auth.js";
import { placeOrder, userOrders, verifyOrder, listOrders, updateStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/placeOrder", auth, placeOrder);
router.post("/verify", verifyOrder);
router.post("/userOrders", auth, userOrders);
router.get("/list", listOrders);
router.post("/status", updateStatus);

export default router;
