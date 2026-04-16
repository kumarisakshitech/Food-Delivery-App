import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  console.log("\n========================");
  console.log("🔹 Incoming Authorization Header:", authHeader);

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  console.log("🔹 Extracted Token:", token);

  if (!token) {
    console.log("❌ Token Missing");
    return res.status(401).json({ success: false, message: "User not logged in (No token)" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✔ Token Verified User:", decoded);
    req.userId = decoded.id || decoded._id || decoded.userId;
    next();
  } catch (err) {
    console.log("❌ Token Invalid:", err.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default auth;
