import { DataTypes, Model, Association } from "sequelize";
import sequelize from "../config/database";
import { CATEGORY_TYPE } from "../helper/constant";
import CarModel from "./CarModels";

class ProductType extends Model {
  public id!: number;
  public name!: string;
  public slug!: string;
  public type!: number;
  public title?: string;
  public description?: string;
  public status!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;
  public department_ids!: string; // JSON array of department IDs stored as TEXT

  public static associations: {
    carModels: Association<ProductType, CarModel>;
  };
}

ProductType.init(
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
    department_ids: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("department_ids");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue(
          "department_ids",
          value ? JSON.stringify(value) : null
        );
      },
    },
    category_ids: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("category_ids");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue("category_ids", value ? JSON.stringify(value) : null);
      },
    },
    product_ids: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("product_ids");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue("product_ids", value ? JSON.stringify(value) : null);
      },
    },
    options: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("options");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue("options", value ? JSON.stringify(value) : null);
      },
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Equivalent to STATUS.active
    },
    is_required: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_multy: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    edit_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: "product_types",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default ProductType;
