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

// Create a user
export const createDepartment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, title, description, is_view, seo_keywords, is_car_product } =
      req.body;
    const { id } = req.user!;
    const slug = generateSlug(name);

    const existingUser = await Department.findOne({ where: { slug } });
    if (existingUser) {
      DUPLICATE_RECORD_RESPONSE(res, "Name");
      return;
    }

    const department = await Department.create({
      name,
      slug: slug,
      title,
      created_by: id,
      description,
      is_view,
      seo_keywords,
      is_car_product,
    });
    console.log(department)
    const msg = recordCreatedMsg("department");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// Create a user
export const listDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { is_view } = req.query;
    const queryConditions: any = { status: STATUS.active };

    if (is_view) {
      queryConditions.is_view = is_view;
    }

    const result = await Department.findAll({
      where: queryConditions,
      order: [["order_index", "ASC"]],
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

//  update
export const upsertDepartment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, title, description, is_view, slug, seo_keywords ,is_car_product } = req.body;
    const { id } = req.user!;
    const { department_id } = req.params;
    const existingDepartment = await Department.findOne({
      where: { slug, id: { [Op.ne]: department_id } },
    });

    if (existingDepartment) {
      DUPLICATE_RECORD_RESPONSE(res, "Slug");
      return;
    }

    const updated = await Department.update(
      { name, title, description, is_view, slug, edit_by: id, seo_keywords ,is_car_product },
      { where: { id: department_id } }
    );
    const msg = recordUpdatedMsg("Department");

    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

//  delete
export const deleteDepartment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { department_id } = req.params;

    await Department.update(
      { status: STATUS.delete, deleted_at: new Date(), edit_by: id },
      { where: { id: department_id } }
    );

    const msg = recordDeletedMsg("Department ");
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const updateDepartmentOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { departments } = req.body;
    console.log(departments)
    if (!Array.isArray(departments) || departments.length === 0) {
      SERVER_ERROR_RESPONSE(res, "Invalid department list.");
      return;
    }

    // Loop through the array and update each department's order
    await Promise.all(
      departments.map(async (department, index) => {
        await Department.update(
          { order_index: index, edit_by: id },
          { where: { id: department.id } }
        );
      })
    );

    SUCCESS_RESPONSE(res, "Department order updated successfully.");
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};
export const listCarProductDepartments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await Department.findAll({
      where: {
        is_car_product: true,
        status: STATUS.active, // Optional: if you only want active items
      },
      order: [["order_index", "ASC"]],
    });

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, { result });
  } catch (error) {
    console.error("Error fetching car product departments:", error);
    SERVER_ERROR_RESPONSE(res);
  }
};
