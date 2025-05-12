import { Request, Response } from "express";
import { randomUUID } from "crypto";
import axios from "axios";
import { confirmPayment, placeOrder } from "./checkOut";
import Cart from "../models/Cart";
import Order from "../models/Order";
import User from "../models/User";
import { confirmPaymentOfholeSale, placeOrderOfWholesale } from "./wholesaleCheckOut";
import WholesaleCart from "../models/WholesaleCart";
import WholesaleOrder from "../models/WholesaleOrder";

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN; // Replace with your Square API access token
// const SQUARE_API_URL = "https://connect.squareupsandbox.com/v2";
const SQUARE_API_URL = "https://connect.squareup.com/v2";
// "https://api.afterpay.com"
const AFTERPAY_API_URL =
  process.env.AFTERPAY_API_URL || "https://global-api.afterpay.com"; // or sandbox URL

const AFTERPAY_CLIENT_ID = process.env.AFTERPAY_CLIENT_ID;
const AFTERPAY_CLIENT_SECRET = process.env.AFTERPAY_CLIENT_SECRET;
const authToken = Buffer.from(
  `${AFTERPAY_CLIENT_ID}:${AFTERPAY_CLIENT_SECRET}`
).toString("base64");

// ✅ Step 1: Create Payment
export const createPayment = async (req: Request, res: Response) => {
  try {
    const {
      shippingAddress,
      billingAddress,
      productData,
      paymentMethod,
      user,
      discount,
      selectedShipping,
      deviceDetails,
    } = req.body;

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

    const amount = order.total_paid_value.toString();
    let consumer;

    if (user) {
      const useDetail = await User.findOne({
        where: { id: user.id },
      });
      consumer = {
        givenNames: (useDetail as any).name,
        surname: (useDetail as any).last_name,
        email: (useDetail as any).email,
        countryCode: (useDetail as any).country.iso2,
        phoneNumber: (useDetail as any).phone,
      };
    } else {
      consumer = {
        givenNames: billingAddress.name,
        surname: billingAddress.last_name,
        email: billingAddress.email,
        countryCode: billingAddress.country.iso2,
        phoneNumber: billingAddress.phone,
      };
    }

    const shipping = {
      name: "Joe Consumer",
      line1: "Level 5",
      line2: "390 Collins Street",
      area1: "Melbourne",
      region: "VIC",
      postcode: "3000",
      countryCode: "AU",
      phoneNumber: "0400 000 000",
    };

    const response = await axios.post(
      `${AFTERPAY_API_URL}/v2/checkouts`,
      {
        amount: { currency: "AUD", amount },
        merchant: {
          redirectConfirmUrl: `${process.env.WEB_URL}/payment-verify/${order.id}`,
          redirectCancelUrl: `${process.env.WEB_URL}/checkout`,
        },

        consumer,
        merchantReference:order.id
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
          //  'User-Agent' : ""
        'User-Agent': `KayhanAudio/1.0.0 (Next.js/15.1.6; Node.js/20.17.0; Kayhan audio/${AFTERPAY_CLIENT_ID}) https://kayhanaudio.com.au`
    },
      }
    );

    console.log("response.data", response.data);

    res.json({ redirectUrl: response.data.redirectCheckoutUrl }); // Afterpay payment page URL
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// ✅ Step 2: Capture Payment
export const bcapturePaymentV = async (req: Request, res: Response) => {
  try {
    const { user, token } = req.body;
    const { orderId } = req.params; // Your DB order ID
    // const { token } = req.query;

    if (user) {
      await Cart.destroy({ where: { user_id: user?.id } })
        .then(() => console.log("Cart deleted successfully"))
        .catch((err) => console.error("Error deleting cart:", err));
    }

    const response = await axios.get(
      `${AFTERPAY_API_URL}/v2/payments/${token}`, // Use the correct identifier
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
             'User-Agent' :""
          // 'User-Agent': `KayhanAudio/1.0.0 (Next.js/15.1.6; Node.js/20.17.0; Kayhan audio/${AFTERPAY_CLIENT_ID}) https://kayhanaudio.com.au`

        },
      }
    );
console.log("response====",response);

    const order = await Order.findOne({
      where: { id: orderId },
    });

    console.log(response.data);

    if (response.data.status === "APPROVED") {
      const paymentDetail = { token };
      await confirmPayment(paymentDetail, order);

      // res.redirect(`${process.env.WEB_URL}/payment-successful/${orderId}`);
      res.status(200).json({
        success: true,
        message: "Payment successful",
        redirectUrl: `${process.env.WEB_URL}/payment-successful/${orderId}`,
      });
    }

    res.status(400).json({
      success: false,
      message: "Payment not approved",
      data: response.data,
    });
  } catch (error: any) {
    console.log("ppoop",error);

    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

export const capturePaymentV = async (req: Request, res: Response) => {
  try {
    const { user, token ,orderId} = req.body;
    // const { orderId } = req.params; // Your DB order ID
    // const { token } = req.query;
console.log("orderId",orderId);

    if (user) {
      await Cart.destroy({ where: { user_id: user?.id } })
        .then(() => console.log("Cart deleted successfully"))
        .catch((err) => console.error("Error deleting cart:", err));
    }

    const response = await axios.post(
      `${AFTERPAY_API_URL}/v2/payments/capture`, 
      {
        token
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
            //  'User-Agent' :""
          'User-Agent': `KayhanAudio/1.0.0 (Next.js/15.1.6; Node.js/20.17.0; Kayhan audio/${AFTERPAY_CLIENT_ID}) https://kayhanaudio.com.au`

        },
      }
    );
console.log("response====",response.data);

    const order = await Order.findOne({
      where: { id: orderId },
    });

    console.log(response.data);

    if (response.data.status === "APPROVED") {
      const paymentDetail = { token };
      await confirmPayment(paymentDetail, order);

      // res.redirect(`${process.env.WEB_URL}/payment-successful/${orderId}`);
      res.json({   success: true,
        message: "Payment successful",
        redirectUrl: `${process.env.WEB_URL}/payment-successful/${orderId}`, });
      // res.status(200).json({
      //   success: true,
      //   message: "Payment successful",
      //   redirectUrl: `${process.env.WEB_URL}/payment-successful/${orderId}`,
      // });
    }else{
         res.status(400).json({
      success: false,
      message: "Payment not approved",
      data: response.data,
    });
    }

    // res.status(400).json({
    //   success: false,
    //   message: "Payment not approved",
    //   data: response.data,
    // });
  } catch (error: any) {
    console.log("ppoop",error);

    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};


// whoesale

// ✅ Step 1: Create Payment
export const createPaymentForWholesale = async (req: Request, res: Response) => {
  try {
    const {
      shippingAddress,
      billingAddress,
      productData,
      paymentMethod,
      user,
      discount,
      selectedShipping,
      deviceDetails,
    } = req.body;

    const { order } = await placeOrderOfWholesale(
      shippingAddress,
      user,
      billingAddress,
      productData,
      paymentMethod,
      selectedShipping,
      deviceDetails
    );

    const amount = order.total_paid_value.toString();
    let consumer;

    if (user) {
      const useDetail = await User.findOne({
        where: { id: user.id },
      });
      consumer = {
        givenNames: (useDetail as any).name,
        surname: (useDetail as any).last_name,
        email: (useDetail as any).email,
        countryCode: (useDetail as any).country.iso2,
        phoneNumber: (useDetail as any).phone,
      };
    } else {
      consumer = {
        givenNames: billingAddress.name,
        surname: billingAddress.last_name,
        email: billingAddress.email,
        countryCode: billingAddress.country.iso2,
        phoneNumber: billingAddress.phone,
      };
    }
 
    const response = await axios.post(
      `${AFTERPAY_API_URL}/v2/checkouts`,
      {
        amount: { currency: "AUD", amount },
        merchant: {
          redirectConfirmUrl: `${process.env.WHOLESALE_WEB_URL}/payment-verify/${order.id}`,
          redirectCancelUrl: `${process.env.WHOLESALE_WEB_URL}/checkout`,
        },

        consumer,
        merchantReference:order.id
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
          //  'User-Agent' : ""
        'User-Agent': `KayhanAudio/1.0.0 (Next.js/15.1.6; Node.js/20.17.0; Kayhan audio/${AFTERPAY_CLIENT_ID}) https://kayhanaudio.com.au`
    },
      }
    );

    console.log("response.data", response.data);

    res.json({ redirectUrl: response.data.redirectCheckoutUrl }); // Afterpay payment page URL
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};


export const capturePaymentOfWholeSale = async (req: Request, res: Response) => {
  try {
    const { user, token ,orderId} = req.body;
     
console.log("orderId",orderId);

    if (user) {
      await WholesaleCart.destroy({ where: { user_id: user?.id } })
        .then(() => console.log("Cart deleted successfully"))
        .catch((err) => console.error("Error deleting cart:", err));
    }

    const response = await axios.post(
      `${AFTERPAY_API_URL}/v2/payments/capture`, 
      {
        token
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
            //  'User-Agent' :""
          'User-Agent': `KayhanAudio/1.0.0 (Next.js/15.1.6; Node.js/20.17.0; Kayhan audio/${AFTERPAY_CLIENT_ID}) https://kayhanaudio.com.au`

        },
      }
    );
 
    const order = await WholesaleOrder.findOne({
      where: { id: orderId },
    });

  

    if (response.data.status === "APPROVED") {
      const paymentDetail = { token };
      await confirmPaymentOfholeSale(paymentDetail, order);

      // res.redirect(`${process.env.WEB_URL}/payment-successful/${orderId}`);
      res.json({   success: true,
        message: "Payment successful",
        redirectUrl: `${process.env.WHOLESALE_WEB_URL}/payment-successful/${orderId}`, });
   
    }else{
         res.status(400).json({
      success: false,
      message: "Payment not approved",
      data: response.data,
    });
    }
 
  } catch (error: any) {
    

    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};