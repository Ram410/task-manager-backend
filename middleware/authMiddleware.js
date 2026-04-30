import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token (remove "Bearer ")
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, "secret123");

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};