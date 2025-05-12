import axios from "axios";

import { Request, Response } from "express";
import { confirmPayment, placeOrder } from "./checkOut";
import Cart from "../models/Cart";

const PAYPAL_API = process.env.PAYPAL_API!;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const SECRET = process.env.PAYPAL_SECRET!;

const getAccessToken = async () => {
  const { data } = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: { username: CLIENT_ID, password: SECRET },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return data.access_token;
};

interface PayPalOrderResponse {
  id: string;
  status: string;
  links?: { href: string; rel: string; method: string }[];
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      deviceDetails,
      shippingAddress,
      billingAddress,
      user,
      productData,
      paymentMethod,
      discount,
      selectedShipping,
    } = req.body;

    const { order, user: userDetail } = await placeOrder(
      shippingAddress,
      user,
      billingAddress,
      productData,
      paymentMethod,
      discount,
      selectedShipping,
      deviceDetails
    );

    const accessToken = await getAccessToken();

    // Explicitly type the axios response
    const amount =  order.total_paid_value;
    const { data } = await axios.post<PayPalOrderResponse>(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          { amount: { currency_code: "AUD", value: amount.toString() } },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING", // This tells PayPal not to ask for shipping/billing address
          user_action: "PAY_NOW",
        },
        payer: {
          name: {
            given_name: userDetail.name,
            family_name: userDetail.last_name,
          },
          address: {
            address_line_1: billingAddress.street_address,
            address_line_2: billingAddress.street_address,
            admin_area_2: billingAddress.city,
            admin_area_1: billingAddress.state.state_code,
            postal_code: billingAddress.postcode,
            country_code: billingAddress.country.iso2,
          },
          email_address: billingAddress.email,
          phone: {
            phone_type: "MOBILE",
            phone_number: {
              national_number: billingAddress.phone,
            },
          },
        },
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Now TypeScript understands that `data.id` exists
    res.json({ orderID: data.id, order: order });
  } catch (error) {
    console.error("PayPal Order Error:", error);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
};

export const captureOrder = async (req: Request, res: Response) => {
  try {
    const accessToken = await getAccessToken();
    const { orderID, order, user } = req.body;
    if (user) {
      await Cart.destroy({ where: { user_id: user?.id } })
        .then(() => console.log("Cart deleted successfully"))
        .catch((err) => console.error("Error deleting cart:", err));
    }
    // Explicitly type the axios response
    const { data } = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const paymentDetail = { orderID };
    await confirmPayment(paymentDetail, order);
    // Now TypeScript understands that `data.id` exists
    res.json(data);
  } catch (error) {
    console.error("PayPal Order Error:", error);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
};
