import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
 
class CarModel extends Model {
  public id!: number;
  public parent_id?: number; // Parent ID field
  public name!: string;
  public slug!: string;
  public title?: string;
  public description?: string;
  public status!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;
}

CarModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Parent ID can be null for root models
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,  
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
    description: {
      type: DataTypes.STRING,
    },
    seo_keywords: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    edit_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Equivalent to STATUS.active
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
    tableName: "car_models",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default CarModel;
