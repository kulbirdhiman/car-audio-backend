import { Request, Response } from "express";
import { col, fn, Op, Sequelize } from "sequelize";
import {
  RECORD_FETCHED_RESPONSE,
  RECORDWITH_PAGINATION_FETCHED_RESPONSE,
  SERVER_ERROR_RESPONSE,
} from "../helper/apiResponse";

import Product from "../models/Product";
import { STATUS } from "../helper/constant";
import { RECORD_GET_MSG } from "../helper/successMessages";
import Category from "../models/Category";
import CarModel from "../models/CarModels";

// Create a user
// list
export const listProductForSiteMap = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const queryConditions: any = { status: STATUS.active };

    const { rows, count } = await Product.findAndCountAll({
      attributes: ["slug","id","title","in_stock","images"], // Fetch only the slug field
      order: [["name", "ASC"]],
    });

    console.log(rows.map((row) => row.slug)); // Extract slugs from the result

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: rows,
    });

    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const listCompanyModelForSiteMap = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const queryConditions: any = { status: STATUS.active };

    const categories = await Category.findAll({
      attributes: ["slug"], // Fetch only slug from Category
      include: [
        {
          model: CarModel,
          as: "car_models",
          attributes: ["slug"], // Fetch only slug from CarModel
        },
      ],
    });

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: categories,
    });
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};


export const allCarModelsDetail = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const models = await CarModel.findAll({
        attributes: ["slug", "parent_id","id"],
        where: { status: STATUS.active },
      });
  
      let modelYearsMap: Record<string, number[]> = {};
  
      for (const model of models) {
        const queryConditions: any = {
          status: STATUS.active,
          model_id: { [Op.or]: [model.id, model.parent_id] },
        };
  
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
  
        modelYearsMap[model.slug] = Array.from(yearsSet).sort((a, b) => a - b);
      }
  
      RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, { result: modelYearsMap });
    } catch (error) {
      console.log(error);
      SERVER_ERROR_RESPONSE(res);
    }
  };
  
  