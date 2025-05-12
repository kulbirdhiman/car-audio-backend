import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { DEPARTMENT_VIEW, OPTION_TYPE } from "../helper/constant";
import { authenticateUser } from "../middlewares/auth";
import {
  categoryDetail,
  createCategory,
  deleteCategory,
  editCategory,
  listCategory,
} from "../controllers/category";
import {
  createAddOn,
  deleteAddon,
  editAddOn,
  listAddOn,
} from "../controllers/addOn";
import {
  checkVariation,
  createVariation,
  deleteVariation,
  editVariation,
  listVariation,
} from "../controllers/variation";

const router = express.Router();

// v1/add_on

//add
router.post(
  "/add",
  authenticateUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("type_of_option").notEmpty().withMessage("type_of_option is required"),
    body("options")
      .isArray({ min: 1 })
      .withMessage("Please select at least one options"),

    // Validate each object in the options array type_of_option
    body("options.*.name")
    .if(body("type_of_option").equals((OPTION_TYPE.checkbox).toString()))
    .notEmpty()
    .withMessage("Name is required for each option"),


    // body("options.*.name")
    //   .notEmpty()
    //   .withMessage("Name is required for each option"),
  ],
  validateRequest,
  createVariation
);

//list
router.get(
  "/list",

  listVariation
);

//add
router.put(
  "/edit/:variation_id",
  authenticateUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("type_of_option").notEmpty().withMessage("type_of_option is required"),
    body("options")
      .isArray({ min: 1 })
      .withMessage("Please select at least one options"),

    // Validate each object in the options array
    body("options.*.name")
    .if(body("type_of_option").equals((OPTION_TYPE.checkbox).toString()))
    .notEmpty()
    .withMessage("Name is required for each option"),

  ],
  validateRequest,
  editVariation
);

//add
router.put(
  "/delete/:variation_id",
  authenticateUser,

  deleteVariation
);

//check variation
router.post(
  "/check_variation",

  [
    body("product_id").notEmpty().withMessage("Product is required"),
    body("department_id").notEmpty().withMessage("Product is required"),
  ],
  validateRequest,
  checkVariation
);
export default router;
