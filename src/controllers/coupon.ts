import { Request, Response } from "express";
import { Op } from "sequelize";
import {
  DUPLICATE_RECORD_RESPONSE,
  RECORD_FETCHED_RESPONSE,
  RECORDWITH_PAGINATION_FETCHED_RESPONSE,
  SERVER_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from "../helper/apiResponse";
import {
  COUPEN_PRICE_VALIDATION,
  COUPEN_TYPE,
  STATUS,
} from "../helper/constant";
import Department from "../models/Department";
import { generateSlug, recordCreatedMsg, recordDeletedMsg, recordUpdatedMsg } from "../helper/commonFunction";
import { AuthenticatedRequest } from "../interfaces/auth";
import { RECORD_GET_MSG } from "../helper/successMessages";
import Category from "../models/Category";
import CarModel from "../models/CarModels";
import Coupon from "../models/Coupon";

// Create a user
export const createCoupon = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      code,
      coupon_type,
      free_product,
      discount_type,
      price_validation,
      discount_value,
      options = [],
      category_validation,
      department_ids = [],
      categories = [],
      products = [],
      coupon_apply_for_all_time,
      from,
      to,
      minimum_price,
      up_discount_value,
      is_on_discounted_product,
      is_apply_with_other_coupon
    } = req.body;
    const { id } = req.user!;

    const existing = await Coupon.findOne({ where: { code } });
    if (existing) {
      DUPLICATE_RECORD_RESPONSE(res, "Code");
      return;
    }

    await Coupon.create({
      name,
      code,
      coupon_type,
      free_product,
      discount_type,
      price_validation,
      discount_value,
      options,
      category_validation,
      department_ids,
      categories,
      coupon_apply_for_all_time,
      from,
      products,
      to,
      created_by: id,
      minimum_price,
      up_discount_value,
      is_on_discounted_product,
      is_apply_with_other_coupon
    });

    const msg = recordCreatedMsg("Coupon");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const listCoupon = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const queryConditions = {};

 

    const { rows, count } = await Coupon.findAndCountAll({
      where: queryConditions,
      order: [["name", "ASC"]],
      limit: limit,
      offset,
    });

    RECORDWITH_PAGINATION_FETCHED_RESPONSE(
      res,
      RECORD_GET_MSG,
      rows,
      page,
      count,
      limit
    );
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};



// Create a user
export const editCoupon = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      code,
      coupon_type,
      free_product,
      discount_type,
      price_validation,
      discount_value,
      options = [],
      category_validation,
      department_ids = [],
      categories = [],
      products = [],
      from,
      to,
    } = req.body;
    const { id } = req.user!;
    const {coupon_id} = req.params

    const existing = await Coupon.findOne({ where: { code ,id: { [Op.ne]: coupon_id } } });
    if (existing) {
      DUPLICATE_RECORD_RESPONSE(res, "Code");
      return;
    }

    await Coupon.update({
      name,
      code,
      coupon_type,
      free_product,
      discount_type,
      price_validation,
      discount_value,
      options,
      category_validation,
      department_ids,
      categories,
      from,
      products,
      to,
      edit_by: id,
    },
    { where: { id: coupon_id } });

    const msg = recordUpdatedMsg("Coupon");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};


//  delete
export const deleteCoupon = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { coupon_id } = req.params;

    await Coupon.update(
      { status: STATUS.delete, deleted_at: new Date(), edit_by: id },
      { where: { id: coupon_id } }
    );

    const msg = recordDeletedMsg("Coupon ");
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};