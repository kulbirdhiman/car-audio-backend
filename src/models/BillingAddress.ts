import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class BillingAddress extends Model {
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

BillingAddress.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue("country");
        return value ? JSON.parse(value) : {}; // Return an empty object if null
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
        return value ? JSON.parse(value) : {}; // Return an empty object if null
      },
      set(value: Record<string, any> | null) {
        this.setDataValue("state", value ? JSON.stringify(value) : null);
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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
    tableName: "billing_addresses",
    timestamps: true, // Enables createdAt and updatedAt automatically
    paranoid: true, // Enables soft deletion (marks deleted_at instead of deleting)
    underscored: true, // Matches created_at and updated_at field names
  }
);

export default BillingAddress;
