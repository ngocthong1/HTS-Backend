// routes/products.js
const express = require("express");
const router = express.Router();
const { Product, Image } = require("../models");
const verifyToken = require("../middleware/auth");
const { Op } = require("sequelize");

router.get("/categories", async (req, res) => {
  try {
    // Ghi log để kiểm tra
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

router.post("/newproduct", verifyToken, async (req, res) => {
  const { name, description, price, type, category, stock, images } = req.body;

  try {
    // Tạo sản phẩm mới
    const newProduct = await Product.create({
      name,
      description,
      price,
      type,
      category,
      stock,
    });

    // Nếu có hình ảnh, thêm chúng vào cơ sở dữ liệu
    if (images && images.length > 0) {
      const imagePromises = images.map((url) => {
        return Image.create({
          url,
          productId: newProduct.id,
        });
      });
      await Promise.all(imagePromises);
    }

    return res.status(201).json({   message: "Product created successfully", product: newProduct, });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, type, category, stock, images } = req.body;

  try {
    // Tìm sản phẩm theo ID
    const product = await Product.findByPk(id);
    if (!product) {
      console.log(123123);

      return res.status(404).json({ message: "Product not found" });
    }

    // Cập nhật thông tin sản phẩm
    product.name = name;
    product.description = description;
    product.price = price;
    product.type = type;
    product.category = category;
    product.stock = stock;

    await product.save(); // Lưu thay đổi sản phẩm

    // Cập nhật hình ảnh
    if (images) {
      // Xóa các hình ảnh cũ
      await Image.destroy({ where: { productId: id } });

      // Thêm các hình ảnh mới
      const imagePromises = images.map((url) =>
        Image.create({ url, productId: id })
      );
      await Promise.all(imagePromises);
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

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
