import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { STATUS } from "../helper/constant";

interface ColorPrice {
  color: string;
  price: number;
}

class RedirectUrl extends Model {
  public id!: number;
  public name!: string;
  public slug!: string;
  public sku!: string;
  public title?: string;
  public description?: string;
  public specification?: string;
  public length!: number;
  public height!: number;
  public width!: number;
  public weight!: number;
  public quantity!: number;
  public regular_price!: number;
  public discount_price?: number;
  public wholesale_price?: number;
  public department_id!: number;
  public category_id!: number;
  public model_id?: number;
  public from!: number;
  public to!: number;
  public is_color_price!: boolean;
  public color_price!: ColorPrice[];
  public images!: string[];
  public status!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;
}

RedirectUrl.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    create_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    edit_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    destination: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    permanent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "redirect_urls",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default RedirectUrl;
