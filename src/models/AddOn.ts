import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class AddOn extends Model {
  public id!: number;
  public name!: string;
  public status!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;
  public department_ids!: string;
  public category_ids!: string;
  public product_ids!: string;
  public extras!: string;
  public created_by!: number;
  public edit_by?: number;
}

AddOn.init(
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
    department_ids: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]", // Default to empty array
      get() {
        const value = this.getDataValue("department_ids");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue("department_ids", JSON.stringify(value || []));
      },
    },
    category_ids: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]", // Default to empty array
      get() {
        const value = this.getDataValue("category_ids");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue("category_ids", JSON.stringify(value || []));
      },
    },
    product_ids: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]", // Default to empty array
      get() {
        const value = this.getDataValue("product_ids");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue("product_ids", JSON.stringify(value || []));
      },
    },
    extras: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]", // Default to empty array
      get() {
        const value = this.getDataValue("extras");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue("extras", JSON.stringify(value || []));
      },
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Equivalent to STATUS.active
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
    tableName: "add_ons",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default AddOn;
