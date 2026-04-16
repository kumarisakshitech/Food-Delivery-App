import orderModel from "../models/orderModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Check Stripe Key Exists
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY missing in .env");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// -----------------------------------------------------------------------------
// 📌 PLACE ORDER + CREATE STRIPE SESSION
// -----------------------------------------------------------------------------
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173"; // Your React App URL

  try {

    const userId = req.userId; // Received from middleware
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized User" });

    // Save order in DB with default pending + payment false
    const newOrder = new orderModel({
      userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
      status: "Pending",
      date: Date.now()
    });

    await newOrder.save();

    // Stripe Line Items
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    // Add Delivery Fee
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Fee" },
        unit_amount: 40 * 100,
      },
      quantity: 1,
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    return res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("Order Error:", error);
    return res.status(500).json({ success: false, message: "Order Failed" });
  }
};

// -----------------------------------------------------------------------------
// 📌 VERIFY PAYMENT AFTER STRIPE REDIRECT
// -----------------------------------------------------------------------------
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.query; // IMPORTANT FIX

  try {
    if (success === "true") {

      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Confirmed"
      });

      return res.json({ success: true, message: "Payment Successful Order Confirmed" });

    } else {

      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment Failed Order Removed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server Error During Verification" });
  }
}
//user orders for frontend 
const userOrders = async (req,res)=>{
  try {
    const orders = await orderModel.find({userId:req.userId});
    res.json({success:true,data:orders});
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Failed to fetch orders"});
  }
}

// Admin: list all orders
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch orders" });
  }
};

// Admin: update order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to update status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
