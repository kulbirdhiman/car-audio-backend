import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Product from "./Product";

class WholesaleCart extends Model {
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

WholesaleCart.init(
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    variations: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
      get() {
        const value = this.getDataValue("variations");
        return value ? JSON.parse(value) : [];
      },
      set(value: string[] | null) {
        this.setDataValue("variations", value ? JSON.stringify(value) : "[]");
      },
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
    tableName: "wholesale_carts",
    timestamps: true,
    underscored: true,
  }
);

WholesaleCart.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
})

export default WholesaleCart;
