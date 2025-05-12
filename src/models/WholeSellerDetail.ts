import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { v4 as uuidv4 } from "uuid";
import { WHOLESALE_REQUEST_STATUS } from "../helper/constant";

class WholeSellerDetail extends Model {
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

WholeSellerDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.TEXT,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      // unique: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
    company_name: {
      type: DataTypes.TEXT,
      allowNull: true,
     
    },
    buisness_trading_name: {
      type: DataTypes.TEXT,
      allowNull: true,
      
      
    },
    abn_acn: {
      type: DataTypes.TEXT,
      allowNull: true,
     
    },
    website_url: {
      type: DataTypes.TEXT,
      allowNull: true,
     
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
      
     
    },
    street_address: {
      type: DataTypes.TEXT,
      allowNull: true,
     
    
    },
    postcode: {
      type: DataTypes.TEXT,
      allowNull: true,
      
     
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true,
  
    },
    contact_name: {
      type: DataTypes.TEXT,
      allowNull: true,
      
    },

    account_payable_email: {
      type: DataTypes.TEXT,
      allowNull: true,
    
   
    },
    name_of_social_media_channel: {
      type: DataTypes.TEXT,
      allowNull: true,
    
     
    },
    facebook: {
      type: DataTypes.TEXT,
      allowNull: true,
       
    },
    youtube: {
      type: DataTypes.TEXT,
      allowNull: true,
      
    },
    x: {
      type: DataTypes.TEXT,
      allowNull: true,
      
    },
    tiktok: {
      type: DataTypes.TEXT,
      allowNull: true,
      
    
    },
    last_year_turn_over: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    
    
    },
    no_of_employee: {
      type: DataTypes.TEXT,
      allowNull: true,
    
    },
    current_method_of_sales: {
      type: DataTypes.TEXT,
      allowNull: true,
       
    },
    website: {
      type: DataTypes.TEXT,
      allowNull: true,
     
    },
    ebay_and_other_ecommerce_platform: {
      type: DataTypes.TEXT,
      allowNull: true,
    
    },
    shop_photo: {
      type: DataTypes.TEXT,
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
    tableName: "wholesaller_details",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default WholeSellerDetail;
