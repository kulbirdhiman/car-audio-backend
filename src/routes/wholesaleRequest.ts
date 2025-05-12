import express from "express";
import { getUsers, createUser, importUser } from "../controllers/users";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { listOneWholesaleRequest, listWholesaleRequest, sendWholesaleRequest, updateFieldOfRequest, updateMyRequest, updateRequestStatus } from "../controllers/wholesaleRequest";
import { authenticateUser, authorizeRoles } from "../middlewares/auth";
import { ROLES } from "../helper/constant";

const router = express.Router();
// wholesale_request

router.post(
  "/send",
  [
    body("company_name").notEmpty().withMessage("Company name is required"),
    body("buisness_trading_name").notEmpty().withMessage("Buisness trading name is required"),
    body("abn_acn").notEmpty().withMessage("ABN/ACN is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("postcode").notEmpty().withMessage("Post code is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("contact_name").notEmpty().withMessage("Contact name is required"),
    body("account_payable_email").isEmail().withMessage("Email is required"),
    body("last_year_turn_over").notEmpty().withMessage("Last year turn over is required"),
    body("no_of_employee").notEmpty().withMessage("How many employee in your company"),
    body("current_method_of_sales").notEmpty().withMessage("Current method of sale is required"),
    body("shop_photo").notEmpty().withMessage("Shop photo is required"),
  ],
  validateRequest,
  sendWholesaleRequest
);

router.get(
  "/list",
  // authenticateUser,
  // authorizeRoles(ROLES.admin),
  validateRequest,
  listWholesaleRequest
);


router.get(
  "/list/:uuid",
  // authenticateUser,
  // authorizeRoles(ROLES.admin),
  validateRequest,
  listOneWholesaleRequest
);

router.post(
  "/send",
  [
    body("company_name").notEmpty().withMessage("Company name is required"),
    body("buisness_trading_name").notEmpty().withMessage("Buisness trading name is required"),
    body("abn_acn").notEmpty().withMessage("ABN/ACN is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("postcode").notEmpty().withMessage("Post code is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("contact_name").notEmpty().withMessage("Contact name is required"),
    body("account_payable_email").isEmail().withMessage("Email is required"),
    body("last_year_turn_over").notEmpty().withMessage("Last year turn over is required"),
    body("no_of_employee").notEmpty().withMessage("How many employee in your company"),
    body("current_method_of_sales").notEmpty().withMessage("Current method of sale is required"),
    // body("shop_photo").notEmpty().withMessage("Shop photo is required"),
  ],
  validateRequest,
  sendWholesaleRequest
);


router.put(
  "/update_field/:uuid",
  authenticateUser,
  authorizeRoles(ROLES.admin),
  validateRequest,
  updateFieldOfRequest
);


router.put(
  "/update_request/:uuid",
  // authenticateUser,
  // authorizeRoles(ROLES.admin),
  validateRequest,
  updateRequestStatus
);
 
router.put(
  "/update_my_request/:uuid",
  // authenticateUser,
  // authorizeRoles(ROLES.admin),
  validateRequest,
  updateMyRequest
);

export default router;
