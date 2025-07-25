import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { authenticateUser } from "../middlewares/auth";
import {
  AllProductSlug,
  createProduct,
  deleteProduct,
  editProduct,
  listProduct,
  listProductForShop,
  productDetail,
  productDetailForShop,
} from "../controllers/product";

const router = express.Router();

//add
router.post(
  "/add",
  authenticateUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    // body("title").notEmpty().withMessage("Title is required"),
    body("sku").notEmpty().withMessage("SKU is required"),

    body("regular_price").notEmpty().withMessage("Price is required"),
    body("department_id").notEmpty().withMessage("Department is required"),
    body("category_id").custom((value, { req }) => {
      const allowedDepartments = [16,23];
      if (!allowedDepartments.includes(parseInt(req.body.department_id))) {
        if (!value) {
          throw new Error("Category is required for this department");
        }
      }
      return true;
    }),
    body("images")
      .isArray({ min: 1 })
      .withMessage("Please upload atleast one image"),
    body("discount_price")
      .optional()
      .custom((value, { req }) => {
        if (value && parseFloat(value) >= parseFloat(req.body.regular_price)) {
          throw new Error("Discount price must be less than the regular price");
        }
        return true;
      }),
  ],
  validateRequest,
  createProduct
);

//list
router.get("/list", validateRequest, listProduct);

//list
router.get("/list/shop", validateRequest, listProductForShop);

//detail
router.get("/list/:slug", validateRequest, productDetail);

//add
router.post(
  "/edit/:product_id",
  authenticateUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
    // body("title").notEmpty().withMessage("Title is required"),
    body("sku").notEmpty().withMessage("SKU is required"),

    body("regular_price").notEmpty().withMessage("Price is required"),
    body("department_id").notEmpty().withMessage("Department is required"),
    body("category_id").custom((value, { req }) => {
      const allowedDepartments = [16,23];
      if (!allowedDepartments.includes(parseInt(req.body.department_id))) {
        if (!value) {
          throw new Error("Category is required for this department");
        }
      }
      return true;
    }),
    body("images")
      .isArray({ min: 1 })
      .withMessage("Please upload atleast one image"),
    body("discount_price")
      .optional()
      .custom((value, { req }) => {
        if (value && parseFloat(value) >= parseFloat(req.body.regular_price)) {
          throw new Error("Discount price must be less than the regular price");
        }
        return true;
      }),
  ],
  validateRequest,
  editProduct
);

//edit
router.put(
  "/delete/:product_id",
  authenticateUser,

  validateRequest,
  deleteProduct
);

//detail
router.get("/list/shop/:slug", validateRequest, productDetailForShop);


router.route("/product-slug").get(AllProductSlug)


export default router;
