// routes/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Thêm thư viện JWT để tạo token
const router = express.Router();
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [admin, user, seller]
 *             required:
 *               - username
 *               - password
 *               - email
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Internal server error
 */
router.post("/register", async (req, res) => {
  try {
    const { name, password, email, type } = req.body; // Thêm type vào đây

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username: email,
      password: hashedPassword,
      email,
      type: type || "user", // Sử dụng giá trị mặc định nếu không có
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo tên đăng nhập
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // So sánh mật khẩu
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Tạo token với thông tin bổ sung
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        type: user.type,
      }, // Thêm type vào payload
      JWT_SECRET,
      { expiresIn: "10s" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login-firebase", async (req, res) => {
  try {
    const { email } = req.body;

    // Tìm người dùng theo tên đăng nhập
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(403).json({ message: "Account Invalid" });
    }

    // Tạo token với thông tin bổ sung
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        type: user.type,
      }, // Thêm type vào payload
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
