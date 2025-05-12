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
import { addCoupon, getShippingPrice } from "../controllers/checkOut";

const router = express.Router();

//shipping_price
router.post(
  "/shipping_price",
 
  [
    body("shipping_address")
      .notEmpty()
      .withMessage("Shipping Address is required"),
    body("products").notEmpty().withMessage("products are required"),
  ],
  validateRequest,
  getShippingPrice
);


router.post(
  "/add_coupon",
 
  [
    body("code")
      .notEmpty()
      .withMessage("Code is required"),
    body("products").notEmpty().withMessage("products are required"),
  ],
  validateRequest,
  addCoupon
);

export default router;
