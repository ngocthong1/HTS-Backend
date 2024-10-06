// routes/carts.js
const express = require("express");
const router = express.Router();
const { Cart, Product } = require("../models");
const verifyToken = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Cart management
 */

/**
 * @swagger
 * /api/carts/{userId}:
 *   get:
 *     summary: Retrieve the cart of a user
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose cart to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of carts for the user
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    // Tìm tất cả các sản phẩm trong giỏ hàng của người dùng
    const carts = await Cart.findAll({
      where: { UserId: req.params.userId },
      include: [
        {
          model: Product,
          as: "product", // Alias phải khớp với alias trong mô hình Cart
          attributes: ["id", "name", "price", "description"],
        },
      ],
    });

    // Tính toán tổng số lượng và tổng giá trị
    const totalPrice = carts.reduce((total, cart) => {
      return total + cart.quantity * cart.product.price;
    }, 0);

    const ordersCount = carts.reduce((total, cart) => {
      return total + cart.quantity;
    }, 0);

    const addedProducts = carts.map((cart) => ({
      id: cart.product.id,
      name: cart.product.name,
      price: cart.product.price,
      quantity: cart.quantity,
    }));

    // Trả về phản hồi
    res.status(200).json({
      checkout: false,
      ordersCount,
      totalPrice,
      addedProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *             required:
 *               - userId
 *     responses:
 *       201:
 *         description: Cart created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity, actionType } = req.body; // Lấy actionType từ body

  if (
    !userId ||
    !productId ||
    (actionType === "ADD_PRODUCT" && quantity === undefined)
  ) {
    return res.status(400).json({
      message: "userId, productId, and quantity are required for ADD_PRODUCT",
    });
  }

  try {
    const existingCart = await Cart.findOne({
      where: { UserId: userId, ProductId: productId },
    });

    switch (actionType) {
      case "ADD_PRODUCT":
        if (existingCart) {
          existingCart.quantity += quantity; // Tăng số lượng
          await existingCart.save();
          return res.status(200).json(existingCart);
        } else {
          const newCart = await Cart.create({
            UserId: userId,
            ProductId: productId,
            quantity: quantity,
          });
          return res.status(201).json(newCart);
        }

      case "INCREASE":
        if (existingCart) {
          existingCart.quantity += 1; // Tăng số lượng thêm 1
          await existingCart.save();
          return res.status(200).json(existingCart);
        } else {
          return res.status(404).json({ message: "Product not found in cart" });
        }

      case "DECREASE":
        if (existingCart) {
          existingCart.quantity -= 1; // Giảm số lượng thêm 1
          if (existingCart.quantity <= 0) {
            await existingCart.destroy(); // Xóa sản phẩm nếu số lượng <= 0
            return res
              .status(204)
              .json({ message: "Product removed from cart" });
          }
          await existingCart.save();
          return res.status(200).json(existingCart);
        } else {
          return res.status(404).json({ message: "Product not found in cart" });
        }

      case "DELETE":
        if (existingCart) {
          await existingCart.destroy(); // Xóa sản phẩm khỏi giỏ
          return res.status(204).json({ message: "Product removed from cart" });
        } else {
          return res.status(404).json({ message: "Product not found in cart" });
        }

      default:
        return res.status(400).json({ message: "Invalid action type" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;