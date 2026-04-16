import express from "express";
import multer from "multer";
import { addFood, getFoodList } from "../controllers/foodController.js";  // ✅ FIXED: import getFoodList


const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: "uploads",  // ✅ Make sure 'uploads' folder exists
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Routes
router.post("/add", upload.single("image"), addFood);
router.get("/list", getFoodList); // ✅ Now it will work

export default router;
