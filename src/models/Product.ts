import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { STATUS } from "../helper/constant";

interface ColorPrice {
  color: string;
  price: number;
}

class Product extends Model {
  public id!: number;
  public name!: string;
  public slug!: string;
  public sku!: string;
  public title?: string;
  public description?: string;
  public specification?: string;
  public length!: number;
  public height!: number;
  public width!: number;
  public weight!: number;
  public quantity!: number;
  public regular_price!: number;
  public discount_price?: number;
  // public wholesale_price?: number;
  public department_id!: number;
  public category_id!: number;
  public model_id?: number;
  public from!: number;
  public to!: number;
  public is_color_price!: boolean;
  public color_price!: ColorPrice[];
  public images!: string[];
  public status!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    create_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    edit_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      
     
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // unique: true,
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // unique: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    seo_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    search_keywords:{
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seo_keywords:{
      type: DataTypes.TEXT,
      allowNull: true,
    },
    demo_video:{
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    installation_video:{
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    specification: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    length: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    width: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    regular_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    // wholesale_price: {
    //   type: DataTypes.FLOAT,
    //   allowNull: true,
    // },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "departments", key: "id" },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "categories", key: "id" },
    },
    model_id: {
      type: DataTypes.INTEGER,
      references: { model: "car_models", key: "id" },
      allowNull: true,
    },
    from: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue :null ,
      validate: { min: 1900 },
    },
    to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue :null ,
      validate: { max: new Date().getFullYear() },
    },
    user_manual:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    color_price: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "[]",
      get() {
        const rawValue = this.getDataValue("color_price");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value: any) {
        this.setDataValue("color_price", JSON.stringify(value));
      },
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]",
      get() {
        const rawValue = this.getDataValue("images");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value: any) {
        this.setDataValue("images", JSON.stringify(value));
      },
    },
    multi_models: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]",
      get() {
        const rawValue = this.getDataValue("multi_models");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value: any) {
        this.setDataValue("multi_models", JSON.stringify(value));
      },
    },
    multi_categories: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]",
      get() {
        const rawValue = this.getDataValue("multi_categories");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value: any) {
        this.setDataValue("multi_categories", JSON.stringify(value));
      },
    },
    in_stock: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Equivalent to STATUS.active
    },
    in_all: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Equivalent to STATUS.active
    },
    is_color_price: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Equivalent to STATUS.active
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: STATUS.active,
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
    tableName: "products",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Product;
