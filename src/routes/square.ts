import express from "express";

import { captureOrder, createOrder } from "../controllers/paypal";
import { capturePayment, createPayment } from "../controllers/square";

const router = express.Router();

// v1/category

//add
router.post(
  "/create-order",

  createPayment
);

router.post("/capture-payment", capturePayment);

export default router;
