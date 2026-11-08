const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mysql = require("mysql2/promise");

// 모든 단계에서 공유하는 연결 풀. 비밀번호는 .env에서만 관리한다.
module.exports = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cafe_menu_mysql",
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 5,
});
