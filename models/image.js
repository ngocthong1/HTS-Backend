// models/image.js

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image", {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      // Thêm thuộc tính productId
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products", // Tên bảng liên kết
        key: "id",
      },
    },
  });

  Image.associate = (models) => {
    Image.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  };

  return Image;
};
