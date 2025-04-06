// models/cart.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Cart", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
