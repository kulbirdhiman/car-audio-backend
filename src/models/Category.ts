import { DataTypes, Model,Association  } from "sequelize";
import sequelize from "../config/database";
import { CATEGORY_TYPE } from "../helper/constant";
import CarModel from "./CarModels";
 

class Category extends Model {
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
    carModels: Association<Category, CarModel>;
  };

}

Category.init(
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
    type: {
      type: DataTypes.INTEGER,
      defaultValue: CATEGORY_TYPE.company,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    seo_keywords: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Equivalent to STATUS.active
    },
    department_ids: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("department_ids");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue("department_ids", value ? JSON.stringify(value) : null);
      },
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
    tableName: "categories",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

// Association with Car Models
Category.hasMany(CarModel, { foreignKey: "category_id", as: "car_models" });



export default Category;
