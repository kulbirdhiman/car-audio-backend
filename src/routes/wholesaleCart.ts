import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { DEPARTMENT_VIEW, ROLES } from "../helper/constant";
import { createDepartment, deleteDepartment, listDepartment, upsertDepartment } from "../controllers/department";
import { authenticateUser, authorizeRoles } from "../middlewares/auth";
import { addToCart, cartCount, deleteToCart, listCart } from "../controllers/wholesaleCart";
 
const router = express.Router();

// v1/department


//add
router.post(
  "/add",
  authenticateUser,
  authorizeRoles(ROLES.wholesaler),
  [
    body("product_id").notEmpty().withMessage("Product is required"),
    body("quantity").isNumeric().notEmpty().withMessage("Quantity is required")
  ],
  validateRequest,
  addToCart
);

router.get(
    "/list",
    authenticateUser,
    authorizeRoles(ROLES.wholesaler),
   
  
    listCart
  );

  router.get(
    "/cart_count",
    authenticateUser,
    authorizeRoles(ROLES.wholesaler),
    cartCount
  );
 

  
  router.delete(
    "/delete/:cart_id",
    authenticateUser,
    authorizeRoles(ROLES.wholesaler),
    deleteToCart
  );
 
 

 

export default router;
