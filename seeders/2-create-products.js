// seeders/20231002-create-products.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Products", [
      {
        name: "T-Shirt",
        description: "Cotton T-shirt with a stylish design.",
        price: 19.99,
        category: "Apparel",
        type: "Male", // Cập nhật type
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jeans",
        description: "Classic blue denim jeans.",
        price: 49.99,
        category: "Apparel",
        type: "Female", // Cập nhật type
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sneakers",
        description: "Comfortable and trendy sneakers.",
        price: 59.99,
        category: "Footwear",
        type: "Children", // Cập nhật type
        stock: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hat",
        description: "Stylish hat for sunny days.",
        price: 15.99,
        category: "Accessories",
        type: "Female", // Cập nhật type
        stock: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jacket",
        description: "Warm and cozy jacket for cold weather.",
        price: 89.99,
        category: "Apparel",
        type: "Male", // Cập nhật type
        stock: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sunglasses",
        description: "UV protection sunglasses.",
        price: 29.99,
        category: "Accessories",
        type: "Female", // Cập nhật type
        stock: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Backpack",
        description: "Durable backpack for everyday use.",
        price: 39.99,
        category: "Accessories",
        type: "Male", // Cập nhật type
        stock: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dress",
        description: "Elegant dress for special occasions.",
        price: 79.99,
        category: "Apparel",
        type: "Female", // Cập nhật type
        stock: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Shorts",
        description: "Comfortable shorts for summer.",
        price: 24.99,
        category: "Apparel",
        type: "Male", // Cập nhật type
        stock: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Formal Shoes",
        description: "Stylish formal shoes for men.",
        price: 69.99,
        category: "Footwear",
        type: "Male", // Cập nhật type
        stock: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sweater",
        description: "Cozy sweater for chilly days.",
        price: 49.99,
        category: "Apparel",
        type: "Female", // Cập nhật type
        stock: 55,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sports Watch",
        description: "Durable sports watch with multiple features.",
        price: 99.99,
        category: "Accessories",
        type: "Male", // Cập nhật type
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Yoga Mat",
        description: "High-quality yoga mat for fitness lovers.",
        price: 34.99,
        category: "Fitness",
        type: "Female", // Cập nhật type
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Water Bottle",
        description: "Reusable water bottle for on-the-go hydration.",
        price: 14.99,
        category: "Accessories",
        type: "Male", // Cập nhật type
        stock: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Baseball Cap",
        description: "Classic baseball cap for everyday wear.",
        price: 19.99,
        category: "Accessories",
        type: "Male", // Cập nhật type
        stock: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Track Pants",
        description: "Comfortable track pants for workouts.",
        price: 34.99,
        category: "Apparel",
        type: "Female", // Cập nhật type
        stock: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Swimwear",
        description: "Stylish swimwear for beach days.",
        price: 39.99,
        category: "Apparel",
        type: "Children", // Cập nhật type
        stock: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Running Shoes",
        description: "Lightweight shoes for running.",
        price: 79.99,
        category: "Footwear",
        type: "Male", // Cập nhật type
        stock: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Wristband",
        description: "Trendy wristband for daily wear.",
        price: 9.99,
        category: "Accessories",
        type: "Female", // Cập nhật type
        stock: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Laptop Bag",
        description: "Stylish bag for carrying laptops.",
        price: 59.99,
        category: "Accessories",
        type: "Male", // Cập nhật type
        stock: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
