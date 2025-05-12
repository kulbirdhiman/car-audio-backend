import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Department from "./Department";  // Adjust the import path based on your file structure
import Category from "./Category";     // Adjust the import path based on your file structure

class DepartmentCategory extends Model {
  public department_id!: number;
  public category_id!: number;
}

DepartmentCategory.init(
  {
    department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Department,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: "department_categories", // Join table name
    timestamps: false, // No need for timestamps in the join table
  }
);

export default DepartmentCategory;
