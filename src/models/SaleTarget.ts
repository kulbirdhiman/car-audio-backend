import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { STATUS } from "../helper/constant";

class SaleTarget extends Model {
  public id!: number;
  public ebay!: number;
  public wholesale!: number;
  public retail!: number;
  public walk_in!: number;
  public type!: number;
  public start_date!: Date;
  public end_date!: Date;
}

SaleTarget.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ebay: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wholesale: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    retail: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    walk_in: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
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
    tableName: "sale_targets",
    timestamps: true, // uses createdAt/updatedAt automatically
    paranoid: true, // adds deletedAt
    underscored: true, // converts camelCase fields to snake_case in DB
  }
);

export default SaleTarget;
