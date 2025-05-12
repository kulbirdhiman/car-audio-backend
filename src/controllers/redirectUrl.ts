import { Request, Response } from "express";
import { col, fn, Op, Sequelize } from "sequelize";
import {
  DUPLICATE_RECORD_RESPONSE,
  RECORD_FETCHED_RESPONSE,
  RECORDWITH_PAGINATION_FETCHED_RESPONSE,
  SERVER_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from "../helper/apiResponse";

import {
  generatePagination,
  generateSlug,
  recordCreatedMsg,
  recordDeletedMsg,
  recordUpdatedMsg,
} from "../helper/commonFunction";
import { AuthenticatedRequest } from "../interfaces/auth";

import Product from "../models/Product";
import { STATUS } from "../helper/constant";
import { RECORD_GET_MSG } from "../helper/successMessages";
import Department from "../models/Department";
import Category from "../models/Category";
import CarModel from "../models/CarModels";
import AddOn from "../models/AddOn";
import Variation from "../models/Variation";
import RedirectUrl from "../models/RedirectUrl";

// Create a user
export const createRedirectUrl = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { source, destination } = req.body;
    const { id } = req.user!;

    const existing = await RedirectUrl.findOne({ where: { source } });
    if (existing) {
      DUPLICATE_RECORD_RESPONSE(res, "Source");
      return;
    }

    await RedirectUrl.create({
      source,
      destination,

      created_by: id,
    });

    const msg = recordCreatedMsg("Redirect Url");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// list
export const listRedirectUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { category, company, model, search, product_ids = [] } = req.query;

    const queryConditions: any = { status: STATUS.active };

    if (search) {
      queryConditions[Op.or] = [
        { source: { [Op.like]: `%${search}%` } },
        { destination: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await RedirectUrl.findAndCountAll({
      where: queryConditions,
      order: [["id", "DESC"]],
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
export const editRedirectUrl = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { source, destination } = req.body;
    const { id } = req.user!;
    const { redirect_url_id } = req.params;

    const existing = await RedirectUrl.findOne({
      where: { source, id: { [Op.ne]: redirect_url_id } },
    });
    if (existing) {
      DUPLICATE_RECORD_RESPONSE(res, "Source");
      return;
    }

    await RedirectUrl.update(
      {
        source,
        destination,

        edit_by: id,
      },
      { where: { id: redirect_url_id } }
    );

    const msg = recordUpdatedMsg("Redirect Url");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const deleteRedirectUrl = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { redirect_url_id } = req.params;

    await RedirectUrl.update(
      { status: STATUS.delete, deleted_at: new Date(), edit_by: id },
      { where: { id: redirect_url_id } }
    );

    const msg = recordDeletedMsg("RedirectUrl ");
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};