import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { DEPARTMENT_VIEW, ROLES } from "../helper/constant";
import {
  createDepartment,
  deleteDepartment,
  listDepartment,
  upsertDepartment,
} from "../controllers/department";
import { authenticateUser, authorizeRoles } from "../middlewares/auth";
import { addToCart, listCart } from "../controllers/cart";
import { addAddress } from "../controllers/billingAddress";
import { addCanNotFind } from "../controllers/canNotFInd";
const router = express.Router();

// v1/department

//add
router.post(
  "/add",

  [
    body("name").notEmpty().withMessage(" Name is required"),
    // body("car_make").notEmpty().withMessage(" Last  name is required"),
    body("email").notEmpty().isEmail().withMessage(" Email is required"),
    body("phone")
      .notEmpty()
      .isNumeric()
      .withMessage(" Phone number is required"),
  ],
  validateRequest,
  addCanNotFind
);

export default router;
