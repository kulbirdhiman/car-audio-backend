import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { authenticateUser, checkDomain } from "../middlewares/auth";
import { carModelDetail, createCarModel, deleteCarModel, editCarModel } from "../controllers/carModel";
import { captureOrder, createOrder } from "../controllers/paypal";

const router = express.Router();

// v1/category

//add
router.post(
  "/create-order",
  // checkDomain,
  createOrder
);
 

router.post(
    "/capture-order",
   
    captureOrder
  );
   

  export default router;