// middleware/auth.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const bearerToken = req.headers["authorization"];
  const token = bearerToken && bearerToken.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Kiểm tra lỗi và trả thông báo tương ứng
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token has expired" });
      }
      return res.status(403).json({ message: "Invalid access token" });
    }
    
    req.user = user; // Lưu thông tin người dùng vào req.user
    next();
  });
};

module.exports = verifyToken;
