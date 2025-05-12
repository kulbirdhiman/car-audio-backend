import { DataTypes, Model, Association } from "sequelize";
import sequelize from "../config/database";
import { DateTime } from "luxon"; // Add this line

class WholesaleOrder extends Model {
  public id!: number;
  public order_id!: number;
  public status!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;
}

WholesaleOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, // Only `id` should be auto-incremented in the database
    },
    // order_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   unique: true, // Ensures no duplicate `order_id`
    //   get() {
    //     const rawValue = this.getDataValue("order_id");
    //     return rawValue ? `#${rawValue}` : null; // Format only when fetching
    //   },
    // },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      allowNull: false,
    },

    device_detail: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("device_detail");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("device_detail", value ? JSON.stringify(value) : null);
      },
    },
    user_detail: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("user_detail");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("user_detail", value ? JSON.stringify(value) : null);
      },
    },

    shipping_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("shipping_address");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue(
          "shipping_address",
          value ? JSON.stringify(value) : null
        );
      },
    },
    billing_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("billing_address");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue(
          "billing_address",
          value ? JSON.stringify(value) : null
        );
      },
    },
    payment_detail: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("payment_detail");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue(
          "payment_detail",
          value ? JSON.stringify(value) : null
        );
      },
    },

    products: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("products");
        return value ? JSON.parse(value) : [];
      },
      set(value: Record<string, any>[] | null) {
        this.setDataValue("products", value ? JSON.stringify(value) : null);
      },
    },
    shipping_charge: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sub_total: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    gift_card_discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    coupon_code_discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    total_paid_value: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    payment_status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    payment_method: {
      type: DataTypes.INTEGER, // 1 for Square, 2 for Google Pay
      allowNull: true, // Allow NULL values
      defaultValue: null,
    },
    shippment_method: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shippment_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    selected_shipment : {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    tracking_number : {
      type : DataTypes.STRING,
      allowNull : true
    },
    labe_url : {
      type : DataTypes.STRING,
      allowNull : true
    },
    invoice :{
      type : DataTypes.STRING,
      allowNull : true
    },

    edit_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shipped_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    note_added_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      // defaultValue: DataTypes.NOW,
      // defaultValue: () => DateTime.now().setZone("Australia/Sydney").toISO(),


    },
    updated_at: {
      type: DataTypes.DATE,
      // defaultValue: DataTypes.NOW,
            // defaultValue: () => DateTime.now().setZone("Australia/Sydney").toISO(),
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "wholesale_orders",
    timestamps: false,
    paranoid: true,
    underscored: true,
  }
);

export default WholesaleOrder;
