import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import {
  BAD_REQUEST,
  DUPLICATE_RECORD_RESPONSE,
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

import { RECORD_GET_MSG } from "../helper/successMessages";
 
import CanNotFind from "../models/CanNotFind";
// Create a user
export const addCanNotFind = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, car_make, email, phone, message,car_model } = req.body;
 ;
 
    const add = await CanNotFind.create({
      name,
      car_make,
      email,
      phone,
      message,
      car_model
    });

    const msg = recordCreatedMsg("Record");
    SUCCESS_RESPONSE(res, "Thank you for your interest in Kayhan Audio! Our team will get back to you soon with the best options for your vehicle.");
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};
