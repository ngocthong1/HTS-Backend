// seeders/20231002-create-users.js
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid"); // Import thư viện uuid

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
    const hashedPasswordUser = await bcrypt.hash("user123", 10);
    const hashedPasswordSeller = await bcrypt.hash("seller123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        id: uuidv4(), // Tạo UUID cho người dùng
        name: "Administrator", // Thêm trường name
        username: "admin",
        password: hashedPasswordAdmin,
        email: "admin@example.com",
        type: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(), // Tạo UUID cho người dùng
        name: "Regular User", // Thêm trường name
        username: "user1",
        password: hashedPasswordUser,
        email: "user1@example.com",
        type: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // {
      //   id: uuidv4(), // Tạo UUID cho người dùng
      //   name: "Seller User", // Thêm trường name
      //   username: "seller1",
      //   password: hashedPasswordSeller,
      //   email: "seller1@example.com",
      //   type: "seller",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
