import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import {
  DUPLICATE_RECORD_RESPONSE,
  RECORD_FETCHED_RESPONSE,
  SERVER_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from "../helper/apiResponse";
import { IS_REQUIRED, STATUS } from "../helper/constant";

import {
  recordCreatedMsg,
  recordDeletedMsg,
  recordUpdatedMsg,
} from "../helper/commonFunction";
import { AuthenticatedRequest } from "../interfaces/auth";
import { RECORD_GET_MSG } from "../helper/successMessages";
import Category from "../models/Category";

import AddOn from "../models/AddOn";
import Variation from "../models/Variation";

// Create a user
export const createVariation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      title,
      department_ids,
      category_ids,
      product_ids,
      options,
      is_required,
      is_multy,
      is_quantity_based,
      type_of_option
    } = req.body;
    const { id } = req.user!;

    const existingCategory = await Variation.findOne({ where: { name } });
    // if (existingCategory) {
    //   DUPLICATE_RECORD_RESPONSE(res, "Name");
    //   return;
    // }

    await Variation.create({
      name,
      title,
      category_ids,
      product_ids,
      type_of_option,
      options,
      created_by: id,
      is_multy,
      department_ids,
      is_required,
      is_quantity_based
    });

    const msg = recordCreatedMsg("Variation");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const listVariation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const queryConditions: any = { status: STATUS.active };

    const result = await Variation.findAll({
      where: queryConditions,
      order: [["name", "ASC"]],
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

export const editVariation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      title,
      department_ids,
      category_ids,
      product_ids,
      is_multy,
      options,
      is_required,
      is_quantity_based,
      type_of_option
    } = req.body;
    const { id } = req.user!;
    const { variation_id } = req.params;

    // const existing = await Variation.findOne({
    //   where: { name, id: { [Op.ne]: variation_id } },
    // });

    // if (existing) {
    //   DUPLICATE_RECORD_RESPONSE(res, "name");
    //   return;
    // }

    const updated = await Variation.update(
      {
        name,
        title,
        department_ids,
        category_ids,
        product_ids,
        options,
        is_required,
        edit_by: id,
        is_multy,
        is_quantity_based,
        type_of_option
      },
      { where: { id: variation_id } }
    );
    const msg = recordUpdatedMsg("Add On");

    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

//  delete
export const deleteVariation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { variation_id } = req.params;

    await Variation.update(
      { status: STATUS.delete, deleted_at: new Date(), edit_by: id },
      { where: { id: variation_id } }
    );

    const msg = recordDeletedMsg("Variation");
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// Create a user
export const checkVariation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { department_id, category_id, product_id,variation_ids } = req.body;

  

    // variation
    const variation = await Variation.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              Sequelize.literal(
                `JSON_CONTAINS(department_ids, '${department_id}', '$')`
              ),
              Sequelize.literal(
                `JSON_CONTAINS(category_ids, '${category_id}', '$')`
              ),
              Sequelize.literal(`JSON_CONTAINS(product_ids, '${product_id}', '$')`),
            ],
          },
          { is_required: IS_REQUIRED },
          variation_ids?.length ? { id: { [Op.notIn]: variation_ids } } : {},       
        ],
      },
    });
    

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      variation: variation,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};
