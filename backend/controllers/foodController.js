import foodModel from "../models/foodModel.js";

// Add food
export const addFood = async (req, res) => {
  try {
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.filename, // ✅ make sure 'filename' used
    });
    await food.save();
    res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// Get all foods
export const getFoodList = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching food list" });
  }
};
