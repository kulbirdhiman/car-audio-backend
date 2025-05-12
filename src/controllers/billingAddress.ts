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
import { AuthenticatedRequest } from "../interfaces/auth";
import { RECORD_GET_MSG } from "../helper/successMessages";
import Cart from "../models/Cart";
import Variation from "../models/Variation";
import Product from "../models/Product";
import BillingAddress from "../models/BillingAddress";
// Create a user
export const addAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      last_name,
      email,
      phone,
      country,
      state,
      city,
      street_address,
      postcode,
    } = req.body;
    const { id } = req.user!;

    const existing = await BillingAddress.findOne({
      where: { postcode, user_id: id },
    });

    if (existing) {
      DUPLICATE_RECORD_RESPONSE(res, "Billing Address");
      return;
    }

    const address = await BillingAddress.create({
      name,
      last_name,
      email,
      phone,
      country,
      state,
      city,
      postcode,
      street_address,
      user_id: id,
    });

    const msg = recordCreatedMsg("Address");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const listAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const queryConditions: any = { status: STATUS.active, user_id: id };

    const result = await BillingAddress.findAll({
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

export const editAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      last_name,
      email,
      phone,
      country,
      state,
      city,
      street_address,
      postcode,
    } = req.body;
    const { id } = req.user!;
    const { address_id } = req.params;

    const existing = await BillingAddress.findOne({
      where: { postcode, user_id: id, id: { [Op.ne]: address_id } },
    });

    if (existing) {
      DUPLICATE_RECORD_RESPONSE(res, "Billing Address");
      return;
    }

    const address = await BillingAddress.update(
      {
        name,
        last_name,
        email,
        phone,
        country,
        state,
        city,
        postcode,
        street_address,
      },
      { where: { id: address_id, user_id: id } }
    );

    const msg = recordUpdatedMsg("Address");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const deleteAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { address_id } = req.params;

    const address = await BillingAddress.update(
      { status: STATUS.delete, deleted_at: new Date(), edit_by: id },
      { where: { id: address_id, user_id: id } }
    );

    const msg = recordDeletedMsg("Address");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};
