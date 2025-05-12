import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { DEPARTMENT_VIEW } from "../helper/constant";
import { authenticateUser } from "../middlewares/auth";
import {
  categoryDetail,
  createCategory,
  deleteCategory,
  editCategory,
  listCategory,
} from "../controllers/category";

const router = express.Router();

// v1/category

//add
router.post(
  "/add",
  authenticateUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("department_ids")
      .isArray({ min: 1 })
      .withMessage("Please select a department"),
  ],
  validateRequest,
  createCategory
);

//list
router.get(
  "/list",

  listCategory
);

//edit
router.put(
  "/edit/:category_id",
  authenticateUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
    body("department_ids")
      .isArray({ min: 1 })
      .withMessage("Please select a department"),
  ],
  validateRequest,
  editCategory
);

//edit
router.put(
  "/delete/:category_id",
  authenticateUser,

  validateRequest,
  deleteCategory
);

//edit
router.get(
  "/detail/:slug",

  categoryDetail
);
export default router;
