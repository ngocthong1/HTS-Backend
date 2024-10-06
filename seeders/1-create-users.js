// seeders/20231002-create-users.js
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
    const hashedPasswordUser = await bcrypt.hash("user123", 10);
    const hashedPasswordSeller = await bcrypt.hash("seller123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        username: "admin",
        password: hashedPasswordAdmin,
        email: "admin@example.com",
        type: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "user1",
        password: hashedPasswordUser,
        email: "user1@example.com",
        type: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "seller1",
        password: hashedPasswordSeller,
        email: "seller1@example.com",
        type: "seller",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Thêm nhiều người dùng khác nếu cần
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
