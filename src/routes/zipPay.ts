import express from "express";
import { capturePayment, createZipPayment } from "../controllers/zipPay";
 
const router = express.Router();

// v1/category

//add
router.post(
  "/create-order",

  createZipPayment
);

router.post(
    "/capture-order",
  
    capturePayment
  );
 

 
export default router;
