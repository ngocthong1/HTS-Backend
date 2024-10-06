// models/user.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM("admin", "user", "seller"), // Thêm thuộc tính type
      allowNull: false,
      defaultValue: "user", // Giá trị mặc định
    },
  });
};
