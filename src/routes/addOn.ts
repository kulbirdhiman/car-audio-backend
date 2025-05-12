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
import { createAddOn, deleteAddon, editAddOn, listAddOn } from "../controllers/addOn";

const router = express.Router();

// v1/add_on

//add
router.post(
  "/add",
  authenticateUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("extras").isArray({ min: 1 }).withMessage("Please select a extras"),
  ],
  validateRequest,
  createAddOn
);

//list
router.get(
  "/list",

  listAddOn
);



//add
router.put(
    "/edit/:add_on_id",
    authenticateUser,
    [
      body("name").notEmpty().withMessage("Name is required"),
      body("extras").isArray({ min: 1 }).withMessage("Please select a extras"),
    ],
    validateRequest,
    editAddOn
  );


  //add
router.put(
    "/delete/:add_on_id",
    authenticateUser,
    
    deleteAddon
  );
export default router;




