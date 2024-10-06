// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  // For SSL connections
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import các mô hình
db.User = require("./user")(sequelize, DataTypes);
db.Product = require("./product")(sequelize, DataTypes);
db.Cart = require("./cart")(sequelize, DataTypes);
db.Order = require("./order")(sequelize, DataTypes);
db.OrderItem = require("./orderItem")(sequelize, DataTypes);
db.Image = require("./image")(sequelize, DataTypes);

// Thiết lập quan hệ giữa các mô hình
db.User.hasMany(db.Cart);
db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);
db.Order.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Order);
db.OrderItem.belongsTo(db.Product);

// Thiết lập quan hệ
db.Product.hasMany(db.Image, { foreignKey: "productId", as: "images" });
db.Image.belongsTo(db.Product, { foreignKey: "productId" });
db.Cart.belongsTo(db.User, { foreignKey: "UserId" });
db.Cart.belongsTo(db.Product, { foreignKey: "ProductId", as: "product" }); // Đảm bảo alias là "product"

module.exports = db;
