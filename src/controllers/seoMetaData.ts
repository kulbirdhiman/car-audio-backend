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
import { carModelDetail } from "./carModel";
import RedirectUrl from "../models/RedirectUrl";

 

// detail
export const productSeoMeta = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    // seo_description
    const result = await Product.findOne({
      where: { slug: slug },
      attributes: ['title', 'seo_description', 'seo_keywords','images']
    });
    
    console.log(result);
    

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const categorySeoMeta = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    // seo_description
    const result = await Category.findOne({
      where: { slug: slug },
      attributes: ['title', 'description', 'seo_keywords']
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


export const modelSeoMeta = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    // seo_description
    const result = await CarModel.findOne({
      where: { slug: slug },
      attributes: ['title', 'description', 'seo_keywords']
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


export const redirectUrls = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    const redirect_urls = [
      {
        source: "/product/car-stereo-with-satnav-for-ford-ba-bf-territory-version-6-9-6-inch",
        destination: "/product/car-stereo-with-satnav-for-ford-ba-bf-territory-version-6-9.6-inch",
        permanent: false,
      },
    ]
    const result = await RedirectUrl.findAll({
      where: { },
attributes : ["source","destination","permanent"]
   
      
    });
    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result:result,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};