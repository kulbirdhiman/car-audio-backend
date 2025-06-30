import { Request, Response } from "express";
import { randomUUID } from "crypto";
import axios from "axios";
import { confirmPayment, placeOrder } from "./checkOut";
import Cart from "../models/Cart";
import dotenv from "dotenv";

dotenv.config();

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const isSandbox = process.env.NODE_ENV !== "production";

const SQUARE_API_URL =  "https://connect.squareup.com/v2";

// ✅ Step 1: Create Payment
export const createPayment = async (req: Request, res: Response) => {
  try {
    const {
      sourceId,
      deviceDetails,
      shippingAddress,
      billingAddress,
      user,
      productData,
      paymentMethod,
      discount,
      selectedShipping,
    } = req.body;

    // Place order first (your business logic)
    const { order } = await placeOrder(
      shippingAddress,
      user,
      billingAddress,
      productData,
      paymentMethod,
      discount,
      selectedShipping,
      deviceDetails
    );

    const amountInCents = Math.round(order.total_paid_value * 100);

    const response = await axios.post(
      `${SQUARE_API_URL}/payments`,
      {
        source_id: sourceId,
        idempotency_key: randomUUID(),
        amount_money: {
          amount: amountInCents,
          currency: "USD",
        },
        autocomplete: false,
      },
      {
        headers: {
          Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "Square-Version": "2025-02-20",
        },
      }
    );
    console.log("this is response",response)
    res.json({
      success: true,
      paymentId: response.data.payment.id,
      order: order,
    });
  } catch (error: any) {
    console.log("asss")
    console.error("Create Payment Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// ✅ Step 2: Capture Payment
export const capturePayment = async (req: Request, res: Response) => {
  try {
    const { paymentId, order, user } = req.body;

    if (user) {
      await Cart.destroy({ where: { user_id: user?.id } })
        .then(() => console.log("Cart deleted successfully"))
        .catch((err) => console.error("Error deleting cart:", err));
    }

    const response = await axios.post(
      `${SQUARE_API_URL}/payments/${paymentId}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "Square-Version": "2025-02-20",
        },
      }
    );

    await confirmPayment({ paymentId }, order);

    res.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Capture Payment Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};
