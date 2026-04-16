import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/images", express.static("uploads"));

// 🔥 Routes (CORRECT PATHS)
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);      // ❗ YOU MISSED QUOTE FIXED
app.use("/api/food", foodRouter);
app.use("/api/order", orderRouter);    // Stripe Orders

// Database Connection
connectDB();

app.get("/", (req, res) => {
    res.send("API Working Successfully 🔥");
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
