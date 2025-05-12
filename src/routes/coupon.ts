import express from "express";
import { body, checkSchema } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import {
  COUPEN_CATEGORY_VALIDATION,
  COUPEN_PRICE_VALIDATION,
  COUPEN_TYPE,
  DEPARTMENT_VIEW,
  ROLES,
} from "../helper/constant";

import { getShippingPrice } from "../controllers/checkOut";
import { createCoupon, deleteCoupon, editCoupon, listCoupon } from "../controllers/coupon";
import { authenticateUser, authorizeRoles } from "../middlewares/auth";

const router = express.Router();

//add coupon
router.post(
  "/add",
  authenticateUser,
  authorizeRoles(ROLES.admin),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("code").notEmpty().withMessage("Code are required"),
    body("coupon_type").notEmpty().withMessage("Coupon type is required"),
    body("category_validation")
      .notEmpty()
      .withMessage("Category Validation is required"),

    body("free_product")
      .if(body("coupon_type").equals(COUPEN_TYPE.product.toString()))
      .notEmpty()
      .withMessage("Free product is required ."),
    body("discount_type")
      .if(body("coupon_type").equals(COUPEN_TYPE.discount.toString()))
      .notEmpty()
      .withMessage("Free product is required ."),
    body("price_validation")
      .if(body("coupon_type").equals(COUPEN_TYPE.discount.toString()))
      .notEmpty()
      .withMessage("Price validation is required ."),
    body("discount_value").custom((value, { req }) => {
      const couponType = req.body.coupon_type;
      const priceValidation = req.body.price_validation;
      console.log(priceValidation);

      if (
        couponType === COUPEN_TYPE.discount.toString() &&
        priceValidation === COUPEN_PRICE_VALIDATION.all.toString()
      ) {
        if (!value) {
          throw new Error("Discount Value is required.");
        }
      }
      return true;
    }),

    // body("options")
    //   .if(
    //     (value, { req }) =>
    //       req.body.coupon_type == COUPEN_TYPE.discount.toString() &&
    //       req.body.price_validation ==
    //         COUPEN_PRICE_VALIDATION.based_on_price.toString()
    //   )
    //   .isArray({ min: 1 })
    //   .withMessage("Please select at least one option"),

    // Validate each object in the options array
    // body("options.*.price_up_to")
    //   .if(
    //     (value, { req }) =>
    //       req.body.coupon_type == COUPEN_TYPE.discount.toString() &&
    //       req.body.price_validation ==
    //         COUPEN_PRICE_VALIDATION.based_on_price.toString()
    //   )
    //   .notEmpty()
    //   .withMessage("Price is required for each option")
    //   .isNumeric()
    //   .withMessage("Price must be a number")
    //   .isFloat({ min: 1 })
    //   .withMessage("Price must be at least 1"),
    // body("options.*.discount")
    //   .if(
    //     (value, { req }) =>
    //       req.body.coupon_type == COUPEN_TYPE.discount.toString() &&
    //       req.body.price_validation ==
    //         COUPEN_PRICE_VALIDATION.based_on_price.toString()
    //   )
    //   .notEmpty()
    //   .withMessage("Price is required for each option")
    //   .isNumeric()
    //   .withMessage("Price must be a number")
    //   .isFloat({ min: 1 })
    //   .withMessage("Price must be at least 1"),
    body("department_ids")
      .if(
        body("category_validation").equals(
          COUPEN_CATEGORY_VALIDATION.department.toString()
        )
      )
      .notEmpty()
      .withMessage("Free product is required ."),
    body("categories")
      .if(
        body("category_validation").equals(
          COUPEN_CATEGORY_VALIDATION.category.toString()
        )
      )
      .notEmpty()
      .withMessage("Free product is required ."),
    body("products")
      .if(
        body("category_validation").equals(
          COUPEN_CATEGORY_VALIDATION.product.toString()
        )
      )
      .notEmpty()
      .withMessage("Free product is required ."),
  ],
  validateRequest,
  createCoupon
);

//list
router.get("/list", authenticateUser, authorizeRoles(ROLES.admin), listCoupon);


//add coupon
router.put(
  "/edit/:coupon_id",
  authenticateUser,
  authorizeRoles(ROLES.admin),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("code").notEmpty().withMessage("Code are required"),
    body("coupon_type").notEmpty().withMessage("Coupon type is required"),
    body("category_validation")
      .notEmpty()
      .withMessage("Category Validation is required"),

    body("free_product")
      .if(body("coupon_type").equals(COUPEN_TYPE.product.toString()))
      .notEmpty()
      .withMessage("Free product is required ."),
    body("discount_type")
      .if(body("coupon_type").equals(COUPEN_TYPE.discount.toString()))
      .notEmpty()
      .withMessage("Free product is required ."),
    body("price_validation")
      .if(body("coupon_type").equals(COUPEN_TYPE.discount.toString()))
      .notEmpty()
      .withMessage("Price validation is required ."),
    body("discount_value").custom((value, { req }) => {
      const couponType = req.body.coupon_type;
      const priceValidation = req.body.price_validation;
      console.log(priceValidation);

      if (
        couponType === COUPEN_TYPE.discount.toString() &&
        priceValidation === COUPEN_PRICE_VALIDATION.all.toString()
      ) {
        if (!value) {
          throw new Error("Discount Value is required.");
        }
      }
      return true;
    }),

    // body("options")
    //   .if(
    //     (value, { req }) =>
    //       req.body.coupon_type == COUPEN_TYPE.discount.toString() &&
    //       req.body.price_validation ==
    //         COUPEN_PRICE_VALIDATION.based_on_price.toString()
    //   )
    //   .isArray({ min: 1 })
    //   .withMessage("Please select at least one option"),

    // Validate each object in the options array
    // body("options.*.price_up_to")
    //   .if(
    //     (value, { req }) =>
    //       req.body.coupon_type == COUPEN_TYPE.discount.toString() &&
    //       req.body.price_validation ==
    //         COUPEN_PRICE_VALIDATION.based_on_price.toString()
    //   )
    //   .notEmpty()
    //   .withMessage("Price is required for each option")
    //   .isNumeric()
    //   .withMessage("Price must be a number")
    //   .isFloat({ min: 1 })
    //   .withMessage("Price must be at least 1"),
    // body("options.*.discount")
    //   .if(
    //     (value, { req }) =>
    //       req.body.coupon_type == COUPEN_TYPE.discount.toString() &&
    //       req.body.price_validation ==
    //         COUPEN_PRICE_VALIDATION.based_on_price.toString()
    //   )
    //   .notEmpty()
    //   .withMessage("Price is required for each option")
    //   .isNumeric()
    //   .withMessage("Price must be a number")
    //   .isFloat({ min: 1 })
    //   .withMessage("Price must be at least 1"),
    body("department_ids")
      .if(
        body("category_validation").equals(
          COUPEN_CATEGORY_VALIDATION.department.toString()
        )
      )
      .notEmpty()
      .withMessage("Free product is required ."),
    body("categories")
      .if(
        body("category_validation").equals(
          COUPEN_CATEGORY_VALIDATION.category.toString()
        )
      )
      .notEmpty()
      .withMessage("Free product is required ."),
    body("products")
      .if(
        body("category_validation").equals(
          COUPEN_CATEGORY_VALIDATION.product.toString()
        )
      )
      .notEmpty()
      .withMessage("Free product is required ."),
  ],
  validateRequest,
  editCoupon
);


//list
router.put("/delete/:coupon_id", authenticateUser, authorizeRoles(ROLES.admin), deleteCoupon);




export default router;
