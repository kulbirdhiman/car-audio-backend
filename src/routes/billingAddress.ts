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
import { addAddress, deleteAddress, editAddress, listAddress } from "../controllers/billingAddress";
const router = express.Router();

// v1/department

//add
router.post(
  "/add",
  authenticateUser,
  authorizeRoles(ROLES.customer,),
  [
    body("name").notEmpty().withMessage(" First  name is required"),
    body("last_name").notEmpty().withMessage(" Last  name is required"),
    body("email").notEmpty().isEmail().withMessage(" Email is required"),
    body("phone")
      .notEmpty()
      .isNumeric()
      .withMessage(" Phone number is required"),
    body("state").notEmpty().withMessage(" State is required"),
    body("city").notEmpty().withMessage(" City is required"),
    body("street_address")
      .notEmpty()
      .withMessage(" Street address is required"),
    body("country").isObject().notEmpty().withMessage("Country is required"),
    body("postcode").notEmpty().withMessage("Post code is required"),
  ],
  validateRequest,
  addAddress
);

router.get(
  "/list",
  authenticateUser,
  authorizeRoles(ROLES.customer),
  listAddress
);

router.put(
  "/delete/:address_id",
  authenticateUser,
  authorizeRoles(ROLES.customer,),
  deleteAddress
);



//edit
router.post(
  "/edit/:address_id",
  authenticateUser,
  authorizeRoles(ROLES.customer),
  [
    body("name").notEmpty().withMessage(" First  name is required"),
    body("last_name").notEmpty().withMessage(" Last  name is required"),
    body("email").notEmpty().isEmail().withMessage(" Email is required"),
    body("phone")
      .notEmpty()
      .isNumeric()
      .withMessage(" Phone number is required"),
    body("state").notEmpty().withMessage(" State is required"),
    body("city").notEmpty().withMessage(" City is required"),
    body("street_address")
      .notEmpty()
      .withMessage(" Street address is required"),
    body("country").isObject().notEmpty().withMessage("Country is required"),
    body("postcode").notEmpty().withMessage("Post code is required"),
  ],
  validateRequest,
  authorizeRoles(ROLES.customer),
  editAddress
);

export default router;
