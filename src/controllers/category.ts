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
 

// Create a user
export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, title, description, type, department_ids,seo_keywords } = req.body;
    const { id } = req.user!;
    const slug = generateSlug(name);

    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      DUPLICATE_RECORD_RESPONSE(res, "Name");
      return;
    }

    await Category.create({
      name,
      slug: slug,
      title,
      created_by: id,
      description,
      seo_keywords,
      type,
      department_ids,
    });

    const msg = recordCreatedMsg("Category");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// Create a user
export const listCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, department_id, search,category_ids = [] } = req.query;
    const queryConditions: any = { status: STATUS.active };

    if (type) {
      queryConditions.type = type;
    }

    if (department_id) {
      queryConditions.department_ids = {
        [Op.like]: `%${department_id}%`, // Matches department_id inside JSON array
      };
    }

    if (search) {
      queryConditions[Op.or] = [
        { slug: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } },
      ];
    }

    
    const ids = Array.isArray(category_ids)
      ? category_ids.map(Number)
      : typeof category_ids === "string"
      ? category_ids.split(",").map(Number)
      : [];

    const finalQueryConditions = {
      [Op.or]: [
        queryConditions,  
        ids.length > 0
          ? { id: { [Op.in]: ids } }
          : {}, // Ensure product_ids are included
      ],
    };


    const result = await Category.findAll({
      where: finalQueryConditions,
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

//  edit
export const editCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, title, description, type, slug, department_ids,seo_keywords } = req.body;
    const { id } = req.user!;
    const { category_id } = req.params;

    const existing = await Category.findOne({
      where: { slug, id: { [Op.ne]: category_id } },
    });

    if (existing) {
      DUPLICATE_RECORD_RESPONSE(res, "Slug");
      return;
    }

    const updated = await Category.update(
      { name, title, description, type, department_ids, slug, edit_by: id,seo_keywords },
      { where: { id: category_id } }
    );
    const msg = recordUpdatedMsg("Category");

    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

//  delete
export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { category_id } = req.params;

    await Category.update(
      { status: STATUS.delete, deleted_at: new Date(), edit_by: id },
      { where: { id: category_id } }
    );

    const msg = recordDeletedMsg("Category");
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// detail
export const categoryDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let parent_id = null;
    const { model_id, is_all, search } = req.query;
    const { slug } = req.params;

    const queryConditions: any = { status: STATUS.active };
    if (model_id) {
      parent_id = model_id;
    }

    if (!is_all || is_all == "undefined") {
      queryConditions.parent_id = parent_id;
    }

    if (search) {
      queryConditions[Op.or] = [
        { slug: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } },
      ];
    }

    const result = await Category.findOne({
      where: { slug: slug },
      include: [
        {
          model: CarModel,
          as: "car_models",
          where: queryConditions,
          separate: true, // Fetch car_models separately
          order: [["name", "ASC"]],
          required: false,
    
        },
      ],
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
