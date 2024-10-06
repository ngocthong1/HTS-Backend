// models/order.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Order", {
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Đang xử lý", "Đã giao", "Đã hủy"),
      allowNull: false,
    },
  });
};
