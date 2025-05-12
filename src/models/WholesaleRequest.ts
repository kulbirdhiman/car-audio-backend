import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { v4 as uuidv4 } from "uuid";
import { WHOLESALE_REQUEST_STATUS } from "../helper/constant";

class WholesaleRequest extends Model {
  public id!: number;
  public user_id!: string;
  public name!: string;
  public email!: string;
  public password?: string;
  public role!: string;
  public status!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;
}

WholesaleRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
    uuid: {
      type: DataTypes.TEXT,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      // unique: true,
    },
    company_name: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("company_name");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("company_name", value ? JSON.stringify(value) : null);
      },
    },
    buisness_trading_name: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("buisness_trading_name");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue(
          "buisness_trading_name",
          value ? JSON.stringify(value) : null
        );
      },
    },
    abn_acn: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("abn_acn");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("abn_acn", value ? JSON.stringify(value) : null);
      },
    },
    website_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("website_url");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("website_url", value ? JSON.stringify(value) : null);
      },
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("country");
        return value ? JSON.parse(value) : {};
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("country", value ? JSON.stringify(value) : null);
      },
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("state");
        return value ? JSON.parse(value) : {};
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("state", value ? JSON.stringify(value) : null);
      },
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("city");
        return value ? JSON.parse(value) : {};
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("city", value ? JSON.stringify(value) : null);
      },
    },
    street_address: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("street_address");
        return value ? JSON.parse(value) : {};
      },
      set(value: Record<string, any> | null) {
        this.setDataValue(
          "street_address",
          value ? JSON.stringify(value) : null
        );
      },
    },
    postcode: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("postcode");
        return value ? JSON.parse(value) : {};
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("postcode", value ? JSON.stringify(value) : null);
      },
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("phone");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("phone", value ? JSON.stringify(value) : null);
      },
    },
    contact_name: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("contact_name");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("contact_name", value ? JSON.stringify(value) : null);
      },
    },

    account_payable_email: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("account_payable_email");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue(
          "account_payable_email",
          value ? JSON.stringify(value) : null
        );
      },
    },
    name_of_social_media_channel: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("name_of_social_media_channel");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue(
          "name_of_social_media_channel",
          value ? JSON.stringify(value) : null
        );
      },
    },
    facebook: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("facebook");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("facebook", value ? JSON.stringify(value) : null);
      },
    },
    youtube: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("youtube");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("youtube", value ? JSON.stringify(value) : null);
      },
    },
    x: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("x");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("x", value ? JSON.stringify(value) : null);
      },
    },
    tiktok: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("tiktok");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("tiktok", value ? JSON.stringify(value) : null);
      },
    },
    last_year_turn_over: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("last_year_turn_over");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue(
          "last_year_turn_over",
          value ? JSON.stringify(value) : null
        );
      },
    },
    no_of_employee: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("no_of_employee");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue(
          "no_of_employee",
          value ? JSON.stringify(value) : null
        );
      },
    },
    current_method_of_sales: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("current_method_of_sales");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue(
          "current_method_of_sales",
          value ? JSON.stringify(value) : null
        );
      },
    },
    website: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("website");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("website", value ? JSON.stringify(value) : null);
      },
    },
    ebay_and_other_ecommerce_platform: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("ebay_and_other_ecommerce_platform");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue(
          "ebay_and_other_ecommerce_platform",
          value ? JSON.stringify(value) : null
        );
      },
    },
    shop_photo: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("shop_photo");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("shop_photo", value ? JSON.stringify(value) : null);
      },
    },
    device_detail: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("device_detail");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("device_detail", value ? JSON.stringify(value) : null);
      },
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: WHOLESALE_REQUEST_STATUS.pending, // Equivalent to STATUS.active
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
    tableName: "wholesale_requests",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default WholesaleRequest;
