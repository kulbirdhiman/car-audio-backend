import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    // timezone: "+00:00", // Ensures MySQL handles timestamps correctly

    // dialectOptions: {
    //   timezone: "+00:00", // Ensures MySQL handles timestamps correctly

    // },
    // logging: console.log,
    logging: false,
  }
);

export default sequelize;
