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
import WishList from "../models/WishList";

// Create a user
export const addToWishList = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { product_id } = req.body;
    const { id } = req.user!;
 await WishList.create({
      product_id,
      user_id: id,
    });

    const msg = recordCreatedMsg("WishList");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const listWishList = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.user!;
  
      const queryConditions: any = {};
  
      queryConditions.user_id = id;
  
      const result = await WishList.findAll({
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
              "model_id"
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


  export const deleteToWishList = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const { wish_list_id } = req.params;
      const { id } = req.user!;
   
      
     await WishList.destroy({
        where: { user_id: id, id: wish_list_id },
      });
  
      const msg = recordDeletedMsg("WishList ");
      SUCCESS_RESPONSE(res, msg);
    } catch (error) {
      console.log(error);
      SERVER_ERROR_RESPONSE(res);
    }
  };
  