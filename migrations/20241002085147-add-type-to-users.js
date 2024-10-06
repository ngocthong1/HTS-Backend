// migrations/xxxx-add-type-to-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "type", {
      type: Sequelize.ENUM("admin", "user", "seller"),
      allowNull: false,
      defaultValue: "user", // Giá trị mặc định
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "type");
  },
};
