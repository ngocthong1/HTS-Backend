// routes/products.js
const express = require("express");
const router = express.Router();
const { Product, Image } = require("../models");
const verifyToken = require("../middleware/auth");
const { Op } = require("sequelize");
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Retrieve a list of unique categories from products
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of unique categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCategories:
 *                   type: integer
 *                   description: Total number of unique categories
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique identifier for the category
 *                       name:
 *                         type: string
 *                         description: Name of the category
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get("/categories", async (req, res) => {
  try {
    // Ghi log để kiểm tra
    console.log("Fetching unique categories...");

    const categories = await Product.findAll();

    // Lấy danh sách category từ kết quả
    const uniqueCategories = categories
      .filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.category === product.category)
      )
      .map((item, index) => {
        return { id: index, name: item.category };
      });

    res.status(200).json({
      totalCategories: uniqueCategories.length,
      categories: uniqueCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message); // Ghi log lỗi
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Products]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of items per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: page
 *         in: query
 *         description: Current page number
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: search
 *         in: query
 *         description: Search for products by name
 *         required: false
 *         schema:
 *           type: string
 *       - name: category
 *         in: query
 *         description: Filter products by category
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of items found
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 itemsPerPage:
 *                   type: integer
 *                   description: Number of items per page
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Product ID
 *                       name:
 *                         type: string
 *                         description: Product name
 *                       images:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                               description: URL of the product image
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Số mục mỗi trang
  const page = parseInt(req.query.page) || 1; // Trang hiện tại
  const search = req.query.search || ""; // Giá trị tìm kiếm
  const category = req.query.category || ""; // Giá trị category
  const type = req.query.type || ""; // Giá trị type

  const offset = (page - 1) * limit; // Tính toán chỉ số bắt đầu

  try {
    const { count, rows } = await Product.findAndCountAll({
      include: [
        {
          model: Image,
          as: "images",
          attributes: ["url"],
        },
      ],
      where: {
        name: {
          [Op.like]: `%${search}%`, // Tìm kiếm tên sản phẩm chứa giá trị tìm kiếm
        },
        ...(category && { category }), // Lọc theo category nếu có
        ...(type && { type }), // Lọc theo type nếu có
      },
      limit: limit,
      offset: offset,
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit); // Tính tổng số trang

    // Kiểm tra nếu không có sản phẩm nào
    if (count === 0) {
      return res.status(200).json({
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
        itemsPerPage: limit,
        products: [],
        message: "No products found", // Thông báo không tìm thấy sản phẩm
      });
    }

    res.status(200).json({
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      itemsPerPage: limit,
      products: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Image,
          as: "images", // Đảm bảo alias khớp với tên bạn đã thiết lập
          attributes: ["url"], // Chỉ định thuộc tính nào bạn muốn lấy
        },
      ],
    });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - price
 *     responses:
 *       201:
 *         description: Product created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id);
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
