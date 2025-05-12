import { DataTypes, Model, Association } from "sequelize";
import sequelize from "../config/database";
import { COUPEN_ACTIVATE, COUPEN_APPLY_FOR_ALL_TIME, COUPEN_APPLY_ON_DISCOUNTED_PRODUCT, COUPEN_APPLY_WITH_OTHER_COUPONS } from "../helper/constant";

class Coupon extends Model {
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
}

Coupon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coupon_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    free_product: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discount_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price_validation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discount_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    minimum_price : {
      type: DataTypes.INTEGER,
      // allowNull: true,
      defaultValue:0
    },
    up_discount_value : {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_on_discounted_product:{
      type: DataTypes.INTEGER,
      defaultValue:COUPEN_APPLY_ON_DISCOUNTED_PRODUCT.NO
    },
    is_apply_with_other_coupon:{
      type: DataTypes.INTEGER,
      defaultValue:COUPEN_APPLY_WITH_OTHER_COUPONS.NO
    },
    coupon_apply_for_all_time : {
      type: DataTypes.INTEGER,
      defaultValue: COUPEN_APPLY_FOR_ALL_TIME.YES
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
    category_validation: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    categories: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("categories");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue("categories", value ? JSON.stringify(value) : null);
      },
    },
    products: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("products");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue("products", value ? JSON.stringify(value) : null);
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
    activate: {
      type: DataTypes.INTEGER,
      defaultValue: COUPEN_ACTIVATE.YES, // Equivalent to STATUS.active
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Equivalent to STATUS.active
    },

    from: {
      type: DataTypes.DATEONLY, // Stores only the date (YYYY-MM-DD)
      defaultValue: DataTypes.NOW,
    },
    to: {
      type: DataTypes.DATEONLY, // Stores only the date (YYYY-MM-DD)
      defaultValue: DataTypes.NOW,
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
    tableName: "coupons",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Coupon;
