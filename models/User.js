// models/user.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.STRING, // Đổi kiểu dữ liệu thành UUID
      defaultValue: DataTypes.UUIDV4, // Tự động tạo UUID mới
      primaryKey: true, // Đánh dấu trường này là khóa chính
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
      type: DataTypes.ENUM("admin", "user"), // Thêm thuộc tính type
      allowNull: false,
      defaultValue: "user", // Giá trị mặc định
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Users are active by default
    },
  });
};
