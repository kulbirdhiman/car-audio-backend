import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class User extends Model {
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

User.init(
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
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
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
    phone: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Equivalent to STATUS.active
    },
    otp: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Equivalent to STATUS.active
    },
    otp_date: {
      type: DataTypes.DATE,
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
    tableName: "users",
    timestamps: true, // Enables createdAt and updatedAt automatically
    paranoid: true, // Enables soft deletion (marks deleted_at instead of deleting)
    underscored: true, // Matches created_at and updated_at field names
  }
);

export default User;
