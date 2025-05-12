import { Request, Response } from "express";
import { Op } from "sequelize";
import User from "../models/User";
import {
  DEFAULD_PASSWORD,
  LOCAL_PICKUP,
  PAYMENT_PAID,
  ROLES,
  STATUS,
} from "../helper/constant";
import bcrypt from "bcrypt";
import BillingAddress from "../models/BillingAddress";
import Order from "../models/Order";
import { generateInvoice } from "./test";
import { calculateShipping } from "./checkOut";
import WholesaleOrder from "../models/WholesaleOrder";
interface Product {
  weight: number;
  height: number;
  width: number;
  length: number;
}

export const placeOrderOfWholesale = async (
  shippingAddress: any,
  user_detail: any,
  billing_address: any,
  products: Product[],
  payment_method: string,
  selectedShipping: any,
  deviceDetails: any
): Promise<any> => {
  let shipping_charge = await calculateShipping(shippingAddress, products);

  if (selectedShipping == LOCAL_PICKUP) {
    shipping_charge = 0;
  }
  let user;
  let totalAmount: number;
  let discountValue = 0;
  let couponDiscount = 0;

  user = await User.findOne({
    where: {
      id: user_detail.id,
    },
    attributes: ["id", "name", "last_name", "email", "phone", "country"],
  });

  const sub_total = calculateSubTotal(products);
  totalAmount =
    Number(sub_total) + Number(shipping_charge) - Number(discountValue);
  const offset = 10 * 60; // For UTC+11 (Sydney with daylight saving)
  const ausTime = new Date(new Date().getTime() + offset * 60 * 1000);
  const order = await WholesaleOrder.create({
    user_id: user?.id,
    user_detail: user,
    shipping_address: shippingAddress,
    billing_address: billing_address,
    products: products,
    shipping_charge: shipping_charge,
    sub_total: sub_total,
    total_paid_value: totalAmount,
    payment_method: payment_method,
    total_discount: discountValue,
    coupon_code_discount: couponDiscount,
    selected_shipment: selectedShipping,
    device_detail: deviceDetails,
    created_at: ausTime,
    updated_at: ausTime,
  });

  return { user, order };
};

export const confirmPaymentOfholeSale = async (
  paymentDetail: any,
  order: any
): Promise<void> => {
  try {
    const updated = await WholesaleOrder.update(
      { payment_status: PAYMENT_PAID, payment_detail: paymentDetail },
      { where: { id: order.id } }
    );

    // await generateInvoice(order);
  } catch (error) {
    console.log("error", error);
  }
};

export const calculateSubTotal = (data: any[]): number => {
  const subTotal: number = data.reduce(
    (sum: number, row: any) => sum + calculatePrice(row),
    0
  );

  return subTotal;
};

export const calculatePrice = (row: any): number => {
  let price: number = row.discount_price
    ? row.discount_price
    : row.regular_price;

  if (row.is_free == 1) {
    price = 0;
  }

  const variationPrice: number = row.variations.reduce(
    (sum: number, variation: any) => {
      return (
        sum +
        (variation.is_quantity_based ? row.quantity : 1) *
          variation.options.reduce(
            (optSum: number, option: any) => optSum + option.price,
            0
          )
      );
    },
    0
  );

  console.log("price * row.quantity", price * row.quantity);

  return variationPrice + price * row.quantity;
};

export const calculateSubTotalWithoutDiscount = (data: any[]): number => {
  const subTotal: number = data.reduce(
    (sum: number, row: any) => sum + calculatePriceWithoutDiscount(row),
    0
  );
  return subTotal;
};

export const calculatePriceWithoutDiscount = (row: any): number => {
  let price: number = row.discount_price ? 0 : row.regular_price;

  if (row.is_free == 1) {
    price = 0;
  }

  const variationPrice: number = row.variations.reduce(
    (sum: number, variation: any) => {
      return (
        sum +
        (variation.is_quantity_based ? row.quantity : 1) *
          variation.options.reduce(
            (optSum: number, option: any) => optSum + option.price,
            0
          )
      );
    },
    0
  );

  return variationPrice + price * row.quantity;
};
