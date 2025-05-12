import { Request, Response } from "express";
import { Op } from "sequelize";
import {
  DUPLICATE_RECORD_RESPONSE,
  RECORD_FETCHED_RESPONSE,
  SERVER_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from "../helper/apiResponse";
import { STATUS } from "../helper/constant";
import Department from "../models/Department";
import {
  generateSlug,
  recordCreatedMsg,
  recordDeletedMsg,
  recordUpdatedMsg,
} from "../helper/commonFunction";
import { AuthenticatedRequest } from "../interfaces/auth";
import { RECORD_GET_MSG } from "../helper/successMessages";
import Category from "../models/Category";
import CarModel from "../models/CarModels";
import { log } from "console";
import AddOn from "../models/AddOn";

// Create a user
export const createAddOn = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, department_ids, category_ids, product_ids, extras } =
      req.body;
    const { id } = req.user!;

    const existingCategory = await AddOn.findOne({ where: { name } });
    if (existingCategory) {
      DUPLICATE_RECORD_RESPONSE(res, "Name");
      return;
    }

    await AddOn.create({
      name,
      category_ids,
      product_ids,
      extras,
      created_by: id,
      department_ids,
    });

    const msg = recordCreatedMsg("Extras");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};



export const listAddOn = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { type, department_id, search } = req.query;
      const queryConditions: any = { status: STATUS.active };
  
     
     
   
  
      const result = await AddOn.findAll({
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


  export const editAddOn = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
        const { name, department_ids, category_ids, product_ids, extras } =
      req.body;
    const { id } = req.user!;
      const { add_on_id } = req.params;
  
      const existing = await AddOn.findOne({
        where: { name, id: { [Op.ne]: add_on_id } },
      });
  
      if (existing) {
        DUPLICATE_RECORD_RESPONSE(res, "name");
        return;
      }
  
      const updated = await AddOn.update(
        { name, department_ids, category_ids, product_ids, extras,edit_by:id },
        { where: { id: add_on_id } }
      );
      const msg = recordUpdatedMsg("Add On");
  
      SUCCESS_RESPONSE(res, msg);
    } catch (error) {
      console.error(error);
      SERVER_ERROR_RESPONSE(res);
    }
  };

  //  delete
export const deleteAddon = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.user!;
      const { add_on_id } = req.params;
  
      await AddOn.update(
        { status: STATUS.delete, deleted_at: new Date(), edit_by: id },
        { where: { id: add_on_id } }
      );
  
      const msg = recordDeletedMsg("Add On");
      SUCCESS_RESPONSE(res, msg);
    } catch (error) {
      console.error(error);
      SERVER_ERROR_RESPONSE(res);
    }
  };
  