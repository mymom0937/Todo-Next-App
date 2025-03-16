const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next(); // Move to the next middleware or route
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};
