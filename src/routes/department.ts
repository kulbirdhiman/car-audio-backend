import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { DEPARTMENT_VIEW } from "../helper/constant";
import { createDepartment, deleteDepartment, listCarProductDepartments, listDepartment, updateDepartmentOrder, upsertDepartment } from "../controllers/department";
import { authenticateUser } from "../middlewares/auth";

const router = express.Router();

// v1/department


//add
router.post(
  "/add",
  authenticateUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("is_view")
      .isIn([DEPARTMENT_VIEW.header, DEPARTMENT_VIEW.not_in_header])
      .withMessage(" Please provide correct department view"),
  ],
  validateRequest,
  createDepartment
);

//list
router.get("/list", listDepartment);



//edit
router.put(
  "/edit/:department_id",
  authenticateUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
    body("is_view")
      .isIn([DEPARTMENT_VIEW.header, DEPARTMENT_VIEW.not_in_header])
      .withMessage(" Please provide correct department view"),
  ],
  validateRequest,
  upsertDepartment
);

//edit
router.put(
  "/delete/:department_id",
  authenticateUser,
 
  validateRequest,
  deleteDepartment
);


router.put(
  "/update_order",
  authenticateUser,
 
  updateDepartmentOrder
);
router.get("/departments/car-products", listCarProductDepartments);


export default router;
