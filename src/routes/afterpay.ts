import express from "express";

 
import {   capturePaymentOfWholeSale, capturePaymentV, createPayment, createPaymentForWholesale } from "../controllers/afterpay";
 
const router = express.Router();

// v1/category

//add
router.post(
  "/create-order",

  createPayment
);
router.post(
  "/capture-payment",

  capturePaymentV
);

router.post(
  "/create-wholesale-order",

  createPaymentForWholesale
);
router.post(
  "/capture-wholesale-payment",

  capturePaymentOfWholeSale
);


 
export default router;
