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

// Create a user
export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      title,
      sku,
      description,
      specification,
      length,
      height,
      width,
      weight,
      quantity,
      regular_price,
      discount_price,
      // wholesale_price,
      department_id,
      category_id,
      model_id,
      from,
      to,
      user_manual,
      is_color_price,
      color_price,
      images,
      in_stock,
      seo_description,
      search_keywords,
      seo_keywords,
      demo_video,
      installation_video,
      in_all
    } = req.body;
    const { id } = req.user!;

    let slug = generateSlug(name);

    const existing = await Product.count({
      where: { [Op.or]: [{ slug }] },
    });
    // const existing = await Product.findOne({
    //   where: {
    //     [Op.or]: [
    //       Sequelize.literal(
    //         `CONVERT(slug USING utf8mb4) COLLATE utf8mb4_unicode_ci = '${slug}'`
    //       ),
    //       Sequelize.literal(
    //         `CONVERT(name USING utf8mb4) COLLATE utf8mb4_unicode_ci = '${name}'`
    //       ),
    //     ],
    //   },
    // });

    if (existing) {
      slug = slug + "-" + existing;
      // DUPLICATE_RECORD_RESPONSE(res, "Name");
      // return;
    }
    const existingSku = await Product.findOne({ where: { sku } });
    if (existingSku) {
      DUPLICATE_RECORD_RESPONSE(res, "Sku");
      return;
    }

    const discountPrice = discount_price ? parseFloat(discount_price) : 0;
    // const wholeSalePrice = wholesale_price ? parseFloat(wholesale_price) : 0;
    const totalQuantity = quantity ? parseFloat(quantity) : 0;
    const fromYear = from ? parseFloat(from) : null;
    const toYear = to ? parseFloat(to) : null;

    await Product.create({
      create_by: id,
      name,
      slug,
      title,
      sku,
      description,
      specification,
      length,
      height,
      width,
      weight,
      quantity: totalQuantity,
      regular_price,
      discount_price: discountPrice,
      // wholesale_price: wholeSalePrice,
      department_id,
      category_id,
      model_id,
      from: fromYear,
      to: toYear,
      is_color_price,
      user_manual,
      color_price,
      images,
      in_stock,
      created_by: id,
      seo_description,
      search_keywords,
      seo_keywords,
      demo_video,
      installation_video,
      in_all
    });

    const msg = recordCreatedMsg("Product");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// list
export const listProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { category, company, model, search, product_ids = [] } = req.query;

    const queryConditions: any = { status: STATUS.active };

    if (category) {
      queryConditions.department_id = category;
    }

    if (category) {
      queryConditions.department_id = category;
    }
    if (search) {
      queryConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
      ];
    }

    const parsedProductIds = Array.isArray(product_ids)
      ? product_ids.map(Number)
      : typeof product_ids === "string"
      ? product_ids.split(",").map(Number)
      : [];

    const finalQueryConditions = {
      [Op.or]: [
        queryConditions, // Apply normal filters
        parsedProductIds.length > 0
          ? { id: { [Op.in]: parsedProductIds } }
          : {}, // Ensure product_ids are included
      ],
    };

    const { rows, count } = await Product.findAndCountAll({
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

// detail
export const productDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    const result = await Product.findOne({
      where: { slug: slug },
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

// Create a user
export const editProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      slug,
      name,
      title,
      sku,
      description,
      specification,
      length,
      height,
      width,
      weight,
      quantity,
      regular_price,
      discount_price,
      // wholesale_price,
      department_id,
      category_id,
      model_id,
      from,
      to,
      user_manual,
      is_color_price,
      color_price,
      images,
      multi_models,
      multi_categories,
      in_stock,
      seo_description,
      search_keywords,
      seo_keywords,
      demo_video,
      installation_video,
      in_all
    } = req.body;
    const { id } = req.user!;
    const { product_id } = req.params;
    // const slug = generateSlug(name);

    const existing = await Product.findOne({
      where: { slug, id: { [Op.ne]: product_id } },
    });
    if (existing) {
      DUPLICATE_RECORD_RESPONSE(res, "Slug");
      return;
    }
    const existingSku = await Product.findOne({
      where: { sku, id: { [Op.ne]: product_id } },
    });
    if (existingSku) {
      DUPLICATE_RECORD_RESPONSE(res, "Sku");
      return;
    }

    const discountPrice = discount_price ? parseFloat(discount_price) : 0;
    // const wholeSalePrice = wholesale_price ? parseFloat(wholesale_price) : 0;
    const totalQuantity = quantity ? parseFloat(quantity) : 0;
    const fromYear = from ? parseFloat(from) : null;
    const toYear = to ? parseFloat(to) : null;
    await Product.update(
      {
        name,
        slug,
        title,
        sku,
        description,
        specification,
        length,
        height,
        width,
        weight,
        user_manual,
        quantity: totalQuantity,
        regular_price,
        discount_price: discountPrice,
        // wholesale_price: wholeSalePrice,
        department_id,
        category_id,
        model_id,
        from: fromYear,
        to: toYear,
        is_color_price,
        color_price,
        images,
        created_by: id,
        multi_categories,
        multi_models,
        in_stock,
        seo_description,
        search_keywords,
        seo_keywords,
        demo_video,
        installation_video,
        in_all
      },

      { where: { id: product_id } }
    );

    const msg = recordUpdatedMsg("Product");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

//  delete
export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { product_id } = req.params;

    await Product.update(
      { status: STATUS.delete, deleted_at: new Date(), edit_by: id },
      { where: { id: product_id } }
    );

    const msg = recordDeletedMsg("Product ");
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// list
export const listProductForShop = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { category, company, model, year, search } = req.query;

    const queryConditions: any = { status: STATUS.active };
    const inAllCondition = { in_all: 1 };

    if (search && typeof search === "string") {
      queryConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
        { search_keywords: { [Op.like]: `%${search}%` } },
      ];
    }

    const orConditions: any[] = [
      { ...queryConditions, ...inAllCondition }, // Products visible to all
    ];

    const filterConditions: any = {
      status: STATUS.active,
      in_all: { [Op.ne]: 1 },
    };

    // Category condition
    if (category) {
      const result = await Department.findOne({
        where: { slug: category },
      });

      if (result) {
        filterConditions.department_id = result.id;
      }
    }

    // Company (Category) condition
    if (company) {
      const result = await Category.findOne({ where: { slug: company } });
      if (result) {
        const categoryId = result.id;

        filterConditions[Op.and] = [
          ...(filterConditions[Op.and] || []),
          {
            [Op.or]: [
              { category_id: categoryId },
              Sequelize.literal(
                `JSON_VALID(multi_categories) AND JSON_CONTAINS(multi_categories, '${categoryId}', '$')`
              ),
            ],
          },
        ];
      }
    }

    // Car Model condition
    if (model) {
      const result = await CarModel.findOne({ where: { slug: model } });
      if (result) {
        const modelIdCondition = result.parent_id
          ? { [Op.or]: [result.id, result.parent_id] }
          : result.id;

        filterConditions[Op.and] = [
          ...(filterConditions[Op.and] || []),
          {
            [Op.or]: [
              { model_id: modelIdCondition },
              Sequelize.literal(
                `JSON_VALID(multi_models) AND JSON_CONTAINS(multi_models, '${result.id}', '$')`
              ),
            ],
          },
        ];
      }
    }

    // Year range condition
    if (Number(year) > 0) {
      filterConditions[Op.and] = [
        ...(filterConditions[Op.and] || []),
        { from: { [Op.lte]: year } },
        { to: { [Op.gte]: year } },
      ];
    }

    // If any filters are applied, include them
    if (category || company || model || Number(year) > 0 || search) {
      if (search && typeof search === "string") {
        filterConditions[Op.or] = queryConditions[Op.or];
      }
      orConditions.push(filterConditions);
    }

    const { rows, count } = await Product.findAndCountAll({
      where: { [Op.or]: orConditions },
      order: [["name", "ASC"]],
      limit,
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
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};


// detail for shop

export const productDetailForShop = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    const result = await Product.findOne({
      where: { slug: slug },
    });
    console.log(result , "this is texting")
    const category_id = (result as any).category_id;
    const department_id = (result as any).department_id;
    const product_id = (result as any).id;

    const addOns = await AddOn.findAll({
      where: {
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
    });
    const extras = [...new Set(addOns.flatMap((item) => item.extras))];

    const extrasDetail = await Product.findAll({
      where: { id: extras },
      attributes: [
        "id",
        "name",
        "weight",
        "regular_price",
        "discount_price",
        "images",
        "slug",
        "quantity",
        "department_id",
        "category_id",
        "in_stock",
      ],
    });

    // variation
    const variation = await Variation.findAll({
      where: {
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
    });

    const relatedProduct = await Product.findAll({
      where: {
        [Op.or]: [{ category_id: { [Op.in]: [66, 67, 47, 46] } }, { id: 205 }],
      },
      order: Sequelize.literal("RAND()"), // Fetch random records
      limit: 4,
    });

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
      extras: extrasDetail,
      variation: variation,
      relatedProduct: relatedProduct,
    });
    return;
  } catch (error) {
    console.log("this is error")
    // console.log(error);
    // SERVER_ERROR_RESPONSE(res);
  }
};

const cleanString = (name: string) => name.replace(/[“”″]/g, '"'); // Replace fancy quotes with standard ones

const synonyms: { [key: string]: string[] } = {
  stereo: ["radio", "audio system", "head unit"],
  gps: ["navigation", "satnav"],
  car: ["vehicle", "automobile"],
};

// function expandSearchQuery(search: string): string[] {
//   const words = search.split(" ");
//   return words.flatMap((word) => synonyms[word] || [word]);
// }

// function normalizeSearchTerm(search: string): string {
//   return search
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9 ]/g, ""); // Remove special characters
// }
