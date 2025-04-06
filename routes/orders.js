// routes/orders.js
const express = require("express");
const router = express.Router();
const { Order, OrderItem, Cart, Product, Image } = require("../models");
const verifyToken = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retrieve a list of orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Lấy page và limit từ query params
  const offset = (page - 1) * limit; // Tính toán offset

  try {
    const { count, rows } = await Order.findAndCountAll({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      orders: rows,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "An error occurred while fetching orders." });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Retrieve an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        UserId: req.params.id,
      },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: Image,
                  as: "images",
                  attributes: ["url"],
                },
              ],
            },
          ],
        },
      ],
    });

    // Tính tổng số sản phẩm cho mỗi đơn hàng
    const ordersWithTotal = orders.map((order) => {
      const totalProducts = order.OrderItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      ); // Giả sử có trường `quantity` trong OrderItem
      return {
        ...order.toJSON(), // Chuyển đổi đối tượng Order sang JSON
        totalProducts, // Thêm tổng số sản phẩm vào kết quả
      };
    });

    if (ordersWithTotal.length > 0) {
      res.status(200).json(ordersWithTotal);
    } else {
      res.status(404).json({ message: "No orders found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
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
 *         description: Order created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, async (req, res) => {
  const { total_amount, status, items } = req.body; // Lấy thông tin từ body

  // Kiểm tra các tham số yêu cầu
  if (!total_amount || !status || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "total_amount, status, and items are required",
    });
  }

  try {
    // Tạo đơn hàng
    const order = await Order.create({
      total_amount,
      status,
      UserId: req.user.id, // Lưu UserId từ thông tin xác thực
    });

    // Tạo các mục đơn hàng
    const orderItems = items.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      OrderId: order.id, // Liên kết với Order
      ProductId: item.id, // Lưu ID sản phẩm nếu có
    }));

    // Lưu các mục đơn hàng vào cơ sở dữ liệu
    await OrderItem.bulkCreate(orderItems);

    // Xóa giỏ hàng của người dùng sau khi tạo đơn hàng thành công
    await Cart.destroy({
      where: { UserId: req.user.id },
    });

    // Trả về đơn hàng và các mục đơn hàng
    res.status(201).json({ order, orderItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body; // Lấy trạng thái mới từ body request

  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Cập nhật trạng thái
    order.status = status;
    await order.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Order.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/detail/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderItem,
          attributes: ["ProductId", "quantity", "price"],
          include: [
            {
              model: Product,
              include: [
                {
                  model: Image,
                  as: "images",
                  attributes: ["id", "url", "alt", "isPrimary"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
