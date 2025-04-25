// routes/users.js
/**
 * Module quản lý các route liên quan đến người dùng
 * Bao gồm các chức năng đăng ký, đăng nhập (cả thông thường và qua Firebase)
 *
 * Hệ thống hỗ trợ hai phương thức xác thực:
 * 1. Xác thực thông thường với email/password
 * 2. Xác thực thông qua Firebase Authentication (endpoint /login-firebase)
 */
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Thư viện JWT để tạo token xác thực
const router = express.Router();
const { User } = require("../models");
const { Op } = require("sequelize");
const verifyToken = require("../middleware/auth"); // Middleware xác thực token

// Bí mật để ký JWT token, lấy từ biến môi trường
const JWT_SECRET = process.env.JWT_SECRET;


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

    res.status(201).json({ message: "User registered successfully",user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


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
      { expiresIn: "5d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Route xử lý đăng nhập thông qua Firebase Authentication
 *
 * Endpoint này nhận email từ client sau khi người dùng đã xác thực thành công với Firebase
 * Sau đó kiểm tra xem email này có tồn tại trong cơ sở dữ liệu của hệ thống hay không
 * Nếu tồn tại, tạo JWT token để client có thể sử dụng cho các yêu cầu tiếp theo
 */
router.post("/login-firebase", async (req, res) => {
  try {
    // Lấy email từ request body (đã được xác thực bởi Firebase trên client)
    const { email } = req.body;

    // Tìm người dùng theo email trong cơ sở dữ liệu PostgreSQL
    const user = await User.findOne({ where: { email } });

    // Nếu không tìm thấy người dùng, trả về lỗi
    if (!user) {
      return res.status(403).json({ message: "Account Invalid" });
    }

    // Tạo JWT token với thông tin người dùng
    // Token này sẽ được sử dụng cho việc xác thực các API request tiếp theo
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        type: user.type,
      }, // Thêm type vào payload
      JWT_SECRET,
      { expiresIn: "1d" } // Token có hiệu lực trong 1 ngày
    );

    // Trả về token cho client
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ error: error.message });
  }
});


router.get("/all", async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        type: {
          [Op.ne]: "admin", // Exclude admin users
        },
      },
      attributes: ["id", "name", "username", "email", "type", "isActive"],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ isActive });

    res.status(200).json({
      message: "User status updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Route lấy thông tin người dùng hiện tại
 *
 * @route GET /api/users/profile
 * @access Private - Yêu cầu xác thực token
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'type', 'isActive'] // Không trả về mật khẩu
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Route cập nhật thông tin tài khoản người dùng
 *
 * @route PUT /api/users/profile
 * @access Private - Yêu cầu xác thực token
 */
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Chuẩn bị đối tượng cập nhật
    const updateData = {};

    // Cập nhật tên nếu được cung cấp
    if (name) updateData.name = name;

    // Xử lý cập nhật email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
      }
      updateData.email = email;
      updateData.username = email;
    }

    // Xử lý thay đổi mật khẩu
    if (currentPassword || newPassword) {
      // Kiểm tra cả hai mật khẩu đã được cung cấp chưa
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Vui lòng cung cấp cả mật khẩu hiện tại và mật khẩu mới"
        });
      }

      // Xác minh mật khẩu hiện tại
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Mật khẩu hiện tại không chính xác" });
      }

      // Mã hóa mật khẩu mới
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Kiểm tra có dữ liệu cập nhật không
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Không có thông tin nào được cập nhật" });
    }

    // Cập nhật thông tin người dùng
    await user.update(updateData);

    // Tạo token mới nếu email thay đổi
    const newToken = updateData.email ?
      jwt.sign(
        { id: user.id, username: user.username, email: user.email, type: user.type },
        JWT_SECRET,
        { expiresIn: "5d" }
      ) : null;

    // Trả về kết quả
    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        isActive: user.isActive
      },
      ...(newToken && { token: newToken })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
