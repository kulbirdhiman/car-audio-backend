import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();
console.log("DB Host:", process.env.WP_DB_HOST);
console.log("DB User:", process.env.WP_DB_USER);
console.log("DB Name:", process.env.WP_DB_NAME);

const dbConfig = {
    host: process.env.WP_DB_HOST,
    user: process.env.WP_DB_USER,
    password: process.env.WP_DB_PASS,
    database: process.env.WP_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000, // 30 seconds
  };
  
  export const wpDB = mysql.createPool(dbConfig);
  