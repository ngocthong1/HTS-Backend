// config/firebaseAdmin.js
/**
 * Module này khởi tạo và cấu hình Firebase Admin SDK
 * Firebase Admin SDK được sử dụng để xác thực người dùng từ phía máy chủ
 */
const admin = require("firebase-admin");

// Đọc thông tin xác thực từ file JSON của service account
// File này chứa các khóa bảo mật để kết nối với Firebase
const serviceAccount = require("./config/firebase.json"); // Đường dẫn đến file JSON của service account

// Khởi tạo ứng dụng Firebase Admin với thông tin xác thực
// Sử dụng certificate (cert) để xác thực với Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Xuất module admin để các phần khác của ứng dụng có thể sử dụng
module.exports = admin;
