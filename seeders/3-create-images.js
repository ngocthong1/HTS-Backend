// seeders/20231002-create-images.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Images", [
      {
        productId: 1, // ID của sản phẩm T-Shirt
        url: "https://iili.io/dR1Eyiv.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 1,
        url: "https://iili.io/dR1Eyiv.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 2, // ID của sản phẩm Jeans
        url: "https://iili.io/dR1Eyiv.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 2,
        url: "https://iili.io/dR1Eyiv.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3, // ID của sản phẩm Sneakers
        url: "https://iili.io/dR1Eyiv.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3,
        url: "https://iili.io/dR1Eyiv.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 4, // ID của sản phẩm Hat
        url: "https://iili.io/dR1Eyiv.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Thêm nhiều ảnh cho các sản phẩm khác tương tự
      {
        productId: 5, // ID của sản phẩm Jacket
        url: "https://iili.io/dR1Eyiv.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 6,
        url: "https://iili.io/dR1Eyiv.jpg",
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
