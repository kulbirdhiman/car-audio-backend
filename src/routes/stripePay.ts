import express from "express";
import { createSession, handleStripeWebhook } from "../controllers/stripePay";

 
 
 
const router = express.Router();

// v1/category

//add
router.post(
  "/create-order",

  createSession
);
router.post(
  "/webhook-order",
  express.raw({ type: "application/json" }), // ✅ Required by Stripe
  handleStripeWebhook
);

 
export default router;
