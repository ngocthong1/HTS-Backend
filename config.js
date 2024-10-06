// config/config.js
require("dotenv").config();

module.exports = {
  development: {
    username: "clothing_api_user",
    password: "0jVVX3B6mBGiPtVONI3EvmVwPFQwn3b4",
    database: "clothing_api",
    host: "dpg-crucr3tumphs73el9d4g-a.singapore-postgres.render.com",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Chỉ nên dùng cho phát triển
      },
    },
  },
  test: {
    username: "your_test_db_user",
    password: "your_test_db_password",
    database: "your_test_db_name",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: "clothing_api_user",
    password: "0jVVX3B6mBGiPtVONI3EvmVwPFQwn3b4",
    database: "clothing_api",
    host: "dpg-crucr3tumphs73el9d4g-a.singapore-postgres.render.com",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
