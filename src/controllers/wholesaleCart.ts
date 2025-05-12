import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import {
  BAD_REQUEST,
  RECORD_FETCHED_RESPONSE,
  SERVER_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from "../helper/apiResponse";
import { IS_REQUIRED, STATUS } from "../helper/constant";
import Department from "../models/Department";
import {
  generateSlug,
  recordCreatedMsg,
  recordDeletedMsg,
  recordUpdatedMsg,
} from "../helper/commonFunction";
import { AuthenticatedRequest } from "../interfaces/auth";
import { RECORD_GET_MSG } from "../helper/successMessages";
import Cart from "../models/Cart";
import Variation from "../models/Variation";
import Product from "../models/Product";
import WholesaleCart from "../models/WholesaleCart";

// Create a user
export const addToCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      product_id,
      quantity,
      addOns,
      variations = [],
    } = req.body;
    const { id } = req.user!;
 
 
    const cart = await WholesaleCart.create({
      product_id,
      variations,
      user_id: id,
      quantity,
    });

    if(Array.isArray(addOns)){
      for(let row of addOns){
        await WholesaleCart.create({
          product_id:row.product_id,
          variations:row.variations,
          user_id: id,
          quantity:row.quantity,
        });
      }
    }

    
    const msg = recordCreatedMsg("Product into cart");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// Create a user
export const listCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;

    const queryConditions: any = {};

    queryConditions.user_id = id;

    const result = await WholesaleCart.findAll({
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "images",
            "name",
            "discount_price",
            "regular_price",
            "length",
            "height",
            "department_id",
            "category_id",
            "model_id",
            "wholesale_price"
          ],
        },
      ],
      where: queryConditions,
      order: [["id", "DESC"]],
    });

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const cartCount = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const count = (await WholesaleCart.sum("quantity", {
      where: { user_id: id },
    })) ?? 0;
    

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, { count });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const deleteToCart = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { cart_id } = req.params;
    const { id } = req.user!;
    console.log("cart_id",cart_id,id);
    
    const count = await WholesaleCart.destroy({
      where: { user_id: id, id: cart_id },
    });

    const msg = recordDeletedMsg("Cart ");
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};
