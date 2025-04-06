// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors
const db = require("./models");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swaggerOptions");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Sử dụng middleware cors
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import routes
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/carts");
const orderRoutes = require("./routes/orders");

// Sử dụng routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);

// Đồng bộ hóa các mô hình với cơ sở dữ liệu
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
