// seeders/20231002-create-images.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Images", [
      {
        productId: 1, // ID của sản phẩm T-Shirt
        url: "https://example.com/images/tshirt1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 1,
        url: "https://example.com/images/tshirt2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 2, // ID của sản phẩm Jeans
        url: "https://example.com/images/jeans1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 2,
        url: "https://example.com/images/jeans2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3, // ID của sản phẩm Sneakers
        url: "https://example.com/images/sneakers1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3,
        url: "https://example.com/images/sneakers2.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 4, // ID của sản phẩm Hat
        url: "https://example.com/images/hat1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Thêm nhiều ảnh cho các sản phẩm khác tương tự
      {
        productId: 5, // ID của sản phẩm Jacket
        url: "https://example.com/images/jacket1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 6,
        url: "https://example.com/images/sunglasses1.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Tiếp tục thêm ảnh cho các sản phẩm khác
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Images", null, {});
  },
};
