import express from "express";
import multer from "multer";
import { addFood, getFoodList, removeFood } from "../controllers/foodController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/add", upload.single("image"), addFood);
router.get("/list", getFoodList);
router.post("/remove", removeFood);

export default router;
