import { Request, Response } from "express";
import { Op } from "sequelize";
import {
  DUPLICATE_RECORD_RESPONSE,
  RECORD_FETCHED_RESPONSE,
  RECORDWITH_PAGINATION_FETCHED_RESPONSE,
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
import Product from "../models/Product";

// Create
export const createCarModel = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, title, description, category_id, parent_id,seo_keywords } = req.body;
    const { id } = req.user!;
    const slug = generateSlug(name);

    const existingCategory = await CarModel.findOne({
      where: { slug, category_id },
    });
    if (existingCategory) {
      DUPLICATE_RECORD_RESPONSE(res, "Name");
      return;
    }

    await CarModel.create({
      name,
      slug: slug,
      title,
      created_by: id,
      description,
      parent_id,
      category_id,
      seo_keywords
    });

    const msg = recordCreatedMsg("Car Model ");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

//  edit
export const editCarModel = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, title, description, parent_id, slug, category_id,seo_keywords } = req.body;
    const { id } = req.user!;
    const { model_id } = req.params;

    const existing = await CarModel.findOne({
      where: { slug, id: { [Op.ne]: model_id }, category_id },
    });

    if (existing) {
      DUPLICATE_RECORD_RESPONSE(res, "Slug");
      return;
    }
    const data = { name, title, description, slug, edit_by: id,seo_keywords };
    if (parent_id != model_id) {
      (data as any).parent_id = parent_id;
    }

    const updated = await CarModel.update(data, { where: { id: model_id } });
    const msg = recordUpdatedMsg("Car Model");

    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

//  delete
export const deleteCarModel = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { model_id } = req.params;

    await CarModel.update(
      { status: STATUS.delete, deleted_at: new Date(), edit_by: id },
      { where: { id: model_id } }
    );

    const msg = recordDeletedMsg("Car Model");
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// detail
export const carModelDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { model_id } = req.params;

    const queryConditions: any = { status: STATUS.active };

    if (model_id) {
      const result = await CarModel.findOne({
        where: { id: model_id },
      });

      if (result) {
        queryConditions.model_id = { [Op.or]: [result.id, result.parent_id] };
      }
    }
    const products = await Product.findAll({
      attributes: ["from", "to"],
      where: queryConditions,
    });
    let yearsSet = new Set<number>();

    products.forEach((product) => {
      if (product.from && product.to) {
        for (let year = product.from; year <= product.to; year++) {
          yearsSet.add(year);
        }
      }
    });
    let yearsArray = Array.from(yearsSet)
      .sort((a, b) => a - b)
      .map((year) => ({ slug: year, id: year, name: year }));

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: yearsArray,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const listCarModels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { search, model_ids = [] } = req.query;

    const queryConditions: any = { status: STATUS.active };

    if (search) {
      queryConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    const ids = Array.isArray(model_ids)
      ? model_ids.map(Number)
      : typeof model_ids === "string"
      ? model_ids.split(",").map(Number)
      : [];

    const finalQueryConditions = {
      [Op.or]: [
        queryConditions,
        ids.length > 0 ? { id: { [Op.in]: ids } } : {}, // Ensure product_ids are included
      ],
    };

    const { rows, count } = await CarModel.findAndCountAll({
      where: finalQueryConditions,
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
