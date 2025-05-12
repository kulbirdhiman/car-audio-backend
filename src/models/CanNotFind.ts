import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class CanNotFind extends Model {
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

CanNotFind.init(
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
    car_make: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    car_model: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
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
    tableName: "can_not_finds",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default CanNotFind;
