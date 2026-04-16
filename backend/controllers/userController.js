import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Create JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ---------------------- LOGIN USER ----------------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Create token
    const token = createToken(user._id);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      userId: user._id, // 🔥 Added top-level userId
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error while logging in" });
  }
};

// ---------------------- REGISTER USER ----------------------
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email address" });
    }

    // Password validation
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    return res.json({
      success: true,
      message: "Registration successful",
      token,
      userId: user._id, // 🔥 Added userId
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error while registering" });
  }
};

export { loginUser, registerUser };
