// seeders/20231002-create-orders.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tạo các đơn hàng
    const orders = await queryInterface.bulkInsert(
      "Orders",
      [
        {
          UserId: 1, // ID của người dùng đầu tiên
          total_amount: 79.97, // Tổng tiền cho đơn hàng
          status: "Đang xử lý",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          UserId: 2, // ID của người dùng thứ hai
          total_amount: 59.99, // Tổng tiền cho đơn hàng
          status: "Đã giao",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    ); // Sử dụng { returning: true } để lấy ID của các đơn hàng

    // Tạo các mục trong đơn hàng
    await queryInterface.bulkInsert("OrderItems", [
      {
        OrderId: orders[0].id, // ID của đơn hàng đầu tiên
        ProductId: 1, // ID của sản phẩm đầu tiên
        quantity: 2,
        price: 39.99, // Giá sản phẩm
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        OrderId: orders[0].id, // ID của đơn hàng đầu tiên
        ProductId: 2, // ID của sản phẩm thứ hai
        quantity: 1,
        price: 19.99, // Giá sản phẩm
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        OrderId: orders[1].id, // ID của đơn hàng thứ hai
        ProductId: 3, // ID của sản phẩm thứ ba
        quantity: 1,
        price: 59.99, // Giá sản phẩm
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa các mục trong đơn hàng
    await queryInterface.bulkDelete("OrderItems", null, {});
    // Xóa các đơn hàng
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
