// config/firebaseAdmin.js
const admin = require("firebase-admin");

const serviceAccount = require("./config/firebase.json"); // Đường dẫn đến file JSON của service account

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
