import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);
        const cartData = userData.cartData || {};
        cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1;
        await userModel.findByIdAndUpdate(req.userId, { cartData });
        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding to cart" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);
        const cartData = userData.cartData || {};
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
            if (cartData[req.body.itemId] === 0) delete cartData[req.body.itemId];
        }
        await userModel.findByIdAndUpdate(req.userId, { cartData });
        res.json({ success: true, message: "Removed from cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing from cart" });
    }
};

const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);
        res.json({ success: true, cartData: userData.cartData || {} });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching cart" });
    }
};

export { addToCart, removeFromCart, getCart };
