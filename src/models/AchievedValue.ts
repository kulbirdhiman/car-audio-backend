import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { STATUS } from "../helper/constant";

class AchievedValue extends Model {
  public id!: number;
  public ebay!: number;
  public wholesale!: number;
  public retail!: number;
  public walk_in!: number;
  public type!: number;
  public start_date!: Date;
  public end_date!: Date;
}

AchievedValue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ebay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue : 0
    },
    wholesale: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue : 0
    },
    walk_in: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue : 0
    },
 
    on_date: {
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
    tableName: "achieved_values",
    timestamps: true,  
    paranoid: true,  
    underscored: true,  
  }
);

export default AchievedValue;
