// seeders/20231002-create-carts.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Carts", [
      {
        UserId: 1, // ID của người dùng đầu tiên
        ProductId: 1, // ID của sản phẩm đầu tiên
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 1,
        ProductId: 2, // ID của sản phẩm thứ hai
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 2, // ID của người dùng thứ hai
        ProductId: 3, // ID của sản phẩm thứ ba
        quantity: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 2,
        ProductId: 4, // ID của sản phẩm thứ tư
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Bạn có thể thêm nhiều bản ghi khác tương tự
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Carts", null, {});
  },
};
