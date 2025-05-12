import { Request, Response } from "express";
import { randomUUID } from "crypto";
import axios from "axios";
import { confirmPayment, placeOrder } from "./checkOut";
import Cart from "../models/Cart";
import Order from "../models/Order";
import User from "../models/User";

// "https://api.afterpay.com"
const ZIP_PAY_URL = process.env.ZIP_PAY_URL; // or sandbox URL

const ZIP_PAY_API_KEY = process.env.ZIP_PAY_API_KEY;

// ✅ Step 1: Create Payment
export const createZipPayment = async (req: Request, res: Response) => {
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

    const response = await axios.post(
      `${ZIP_PAY_URL}/checkouts`,
      {
        shopper: {
          // title : ""
          first_name: billingAddress.name,
          last_name: billingAddress.last_name,
          phone: billingAddress.phone,
          email: billingAddress.email,
        },
        order: {
          reference: order.id,
          amount: amount,
          currency: "AUD",
        },
        config: {
          redirect_uri: `${process.env.WEB_URL}payment-verify/zip/${order.id}?amount=${amount}`,
        },
      },
      {
        headers: {
          accept: "application/json",
          "Zip-Version": "2021-08-25",
          Authorization: `Bearer ${ZIP_PAY_API_KEY}`,
          //  'User-Agent' : ""
        },
      }
    );

     
console.log("response.data",response.data);

    res.json({ redirectUrl: response.data.uri }); // Afterpay payment page URL
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

export const capturePayment = async (req: Request, res: Response) => {
  try {
    const { user, token, orderId,checkout_id ,amount,reference} = req.body;
    // const { orderId } = req.params; // Your DB order ID
    // const { token } = req.query;
    console.log("orderId", orderId);

    if (user) {
      await Cart.destroy({ where: { user_id: user?.id } })
        .then(() => console.log("Cart deleted successfully"))
        .catch((err) => console.error("Error deleting cart:", err));
    }

    const response = await axios.post(
      `${ZIP_PAY_URL}/charges`,
      {
        authority : {
            type:"checkout_id",
            value :checkout_id
        },
        reference : orderId ,
        amount,
        currency : "AUD",
        capture : false
      },
      {
        headers: {
            accept: "application/json",
            "Zip-Version": "2021-08-25",
            Authorization: `Bearer ${ZIP_PAY_API_KEY}`,
         
        },
      }
    );

    const captureRes = await axios.post(
        `${ZIP_PAY_URL}/charges/${response.data.id}/capture`,
        {
          authority : {
              type:"checkout_id",
              value :checkout_id
          },
          reference : orderId ,
          amount,
          currency : "AUD",
          "is_partial_capture": false
        },
        {
          headers: {
              accept: "application/json",
              "Zip-Version": "2021-08-25",
              Authorization: `Bearer ${ZIP_PAY_API_KEY}`,
              "idempotency-key" : orderId
          },
        }
      );

 

    const order = await Order.findOne({
      where: { id: orderId },
    });
console.log("captureRes.data====",captureRes.data);

   

    if (captureRes.data.state === "captured") {
      const paymentDetail = { id :captureRes.data.id };
      await confirmPayment(paymentDetail, order);

 
      res.json({
        success: true,
        message: "Payment successful",
        redirectUrl: `${process.env.WEB_URL}/payment-successful/${orderId}`,
      });
 
    } else {
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
    console.log("ppoop", error);

    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};
