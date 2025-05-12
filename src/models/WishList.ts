import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Product from "./Product";

class WishList extends Model {
  public id!: number;
  public product_id!: number;
  public user_id!: number;
  public quantity!: number;
  public variations!: string[];
  public created_by!: number;
  public edit_by?: number;
  public created_at!: Date;
  public updated_at!: Date;
}

WishList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "products", key: "id" },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "wish_lists",
    timestamps: true,
    underscored: true,
  }
);

WishList.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  })

export default WishList;
