import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { authenticateUser } from "../middlewares/auth";
import { carModelDetail, createCarModel, deleteCarModel, editCarModel, listCarModels } from "../controllers/carModel";

const router = express.Router();

// v1/category

//add
router.post(
  "/add",
  authenticateUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("category_id").notEmpty().withMessage("Please select a category"),
  ],
  validateRequest,
  createCarModel
);

//add
router.put(
  "/edit/:model_id",
  authenticateUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
    body("category_id").notEmpty().withMessage("Please select a category"),
  ],
  validateRequest,
  editCarModel
);

//delete
router.put(
  "/delete/:model_id",
  authenticateUser,

  validateRequest,
  deleteCarModel
);


//detail
router.get(
  "/detail/:model_id",
 
  validateRequest,
  carModelDetail
);


router.get("/list",  listCarModels);


export default router;
