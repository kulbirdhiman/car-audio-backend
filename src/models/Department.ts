import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

import { DEPARTMENT_VIEW, STATUS } from "../helper/constant";
class Department extends Model {
  public id!: number;
  public name!: string;
  public slug!: string;
  public title?: string;
  public description?: string;
  public is_view!: number;
  public status!: number;
  public created_by!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;
  is_car_product!: boolean;
}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
    },
    order_index: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    seo_keywords: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_view: {
      type: DataTypes.INTEGER,
      defaultValue: DEPARTMENT_VIEW.not_in_header, // Equivalent to STATUS.active
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    edit_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
        is_car_product: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Set default to false if not provided
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: STATUS.active, // Equivalent to STATUS.active
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "departments",
    timestamps: true, // Automatically includes createdAt and updatedAt
    paranoid: true, // Enables soft deletion (marks deleted_at instead of deleting)
    underscored: true, // Matches created_at and updated_at field names
  }
);

export default Department;
