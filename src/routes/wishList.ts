import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { DEPARTMENT_VIEW, ROLES } from "../helper/constant";
import { createDepartment, deleteDepartment, listDepartment, upsertDepartment } from "../controllers/department";
import { authenticateUser, authorizeRoles } from "../middlewares/auth";
import { addToCart, cartCount, deleteToCart, listCart } from "../controllers/cart";
import { addToWishList, listWishList } from "../controllers/wishList";

const router = express.Router();

// v1/department


//add
router.post(
  "/add",
  authenticateUser,
  authorizeRoles(ROLES.customer),
  [
    body("product_id").notEmpty().withMessage("Product is required") 
  ],
  validateRequest,
  addToWishList
);

router.get(
    "/list",
    authenticateUser,
    authorizeRoles(ROLES.customer),
    listWishList
  );
 

 

export default router;
