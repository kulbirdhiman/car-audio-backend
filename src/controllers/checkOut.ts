import { Request, Response } from "express";
import { Op } from "sequelize";
import {
  BAD_REQUEST,
  DUPLICATE_RECORD_RESPONSE,
  RECORD_FETCHED_RESPONSE,
  SERVER_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from "../helper/apiResponse";
import {
  generateSlug,
  recordCreatedMsg,
  recordDeletedMsg,
  recordUpdatedMsg,
} from "../helper/commonFunction";
import { AuthenticatedRequest } from "../interfaces/auth";
import { RECORD_GET_MSG } from "../helper/successMessages";
import axios from "axios";
import User from "../models/User";
import {
  COUPEN_ACTIVATE,
  COUPEN_APPLY_FOR_ALL_TIME,
  COUPEN_APPLY_ON_DISCOUNTED_PRODUCT,
  COUPEN_CATEGORY_VALIDATION,
  COUPEN_DISCOUNT_TYPE,
  COUPEN_PRICE_VALIDATION,
  COUPEN_TYPE,
  DEFAULD_PASSWORD,
  LOCAL_PICKUP,
  PAYMENT_PAID,
  ROLES,
  STATUS,
} from "../helper/constant";
import bcrypt from "bcrypt";
import BillingAddress from "../models/BillingAddress";
import Order from "../models/Order";
import Coupon from "../models/Coupon";
import ProductModel from "../models/Product";
// import { generateInvoice } from "./test";
interface Product {
  weight: number;
  height: number;
  width: number;
  length: number;
}

export const calculateShipping = async (
  shippingAddress: any,
  products: any[]
): Promise<number> => {
  if (shippingAddress?.country?.iso2 != "AU") {
    const totalWeight = products?.reduce(
      (total, product) =>
        total + (typeof product.weight === "number" ? product.weight : 4),
      0
    );

    const queryStrings = {
      country_code: shippingAddress?.country?.iso2,
      weight: totalWeight, // Example weight, adjust based on products
      service_code: "INT_PARCEL_STD_OWN_PACKAGING", // Example service code
    };

    

    try {
      const response = await axios.get(
        "https://digitalapi.auspost.com.au/postage/parcel/international/calculate",
        {
          headers: {
            "Content-Type": "application/json",
            "AUTH-KEY": process.env.AUSTRALIA_POST_API_KEY, // Ensure this is set in your environment variables
          },
          params: queryStrings, // Ensure queryStrings is correctly defined
        }
      );
      console.log("response", response.data.postage_result.total_cost);

      response.data.postage_result.total_cost; // Default to 99 if no cost is returned
      console.log(products.length * 20);

      const cost =
        (Number(response.data.postage_result.total_cost) + 20)
        // Number(products.length * 20);
      console.log(cost);
      if(cost < 100){
        return 110 ;
      }

      return Math.ceil(cost); // Rounds to the nearest integer
    } catch (error) {
      // console.error("Error calculating shipping:", error);
      return -1;
      return 99;
    }
  } else {
    // length = 430  , height = 330, width=200,weight = 4kg
    const data = products.reduce(
      (acc, item) => {
        return {
          RateType: "ITEM",
          Items: 1,
          height: Math.max(acc.height, item.height || 80),
          width: Math.max(acc.width, item.width || 150),
          length: acc.length + (item.length || 300),
          weight: acc.weight + (item.weight || 4),
          Cubic: 0,
        };
      },
      { height: 0, width: 0, length: 0, weight: 0 }
    );
    data.height = data.height / 10;
    data.width = data.width / 10;
    data.length = data.length / 10;

    // data.height = data.height / 10;

    try {
      const queryStrings = {
        SuburbFrom: "Laverton North",
        PostcodeFrom: "3026",
        SuburbTo: shippingAddress.city,
        PostcodeTo: shippingAddress.postcode,
        ConsignmentLineItems: [data],
      };

      const  headers= {
        "Content-Type": "application/json",
        AccountNumber: process.env.DIRECT_FRIEGHT_EXPRESS_ACCOUNT_NUMBER,
        Authorisation: process.env.DIRECT_FRIEGHT_EXPRESS_PRICE_CALCULATE,
      }

      
      const response = await axios.post(
        "https://webservices.directfreight.com.au/Dispatch/api/GetConsignmentPrice/",
        queryStrings,
        {
          headers: {
            "Content-Type": "application/json",
            AccountNumber: process.env.DIRECT_FRIEGHT_EXPRESS_ACCOUNT_NUMBER,
            Authorisation: process.env.DIRECT_FRIEGHT_EXPRESS_PRICE_CALCULATE,
          },
        }
      );
 

      const charges = response?.data?.TotalFreightCharge + (0.2)*response?.data?.TotalFreightCharge  + 10
      
      
      // response.data.TotalFreightCharge
      // response.data.OnForwardCharge +
      // response.data.FuelLevy +
      // response.data.FuelLevyCharge +
      // response.data.StandardCharge;

      if (response.data.TotalFreightCharge == 0) {
        return 25;
      }

      return Math.ceil(charges); // Rounds to the nearest integer
    } catch (error) {
      console.log(error);
      return -1;
    }

    return 99;
  }
};

// Create a user
export const getShippingPrice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { products, shipping_address } = req.body;

    const carBattery = 16;
    const subBooferbox = 69;
    console.log("products", products);

    if (
      products.some(
        (r: any) =>
          r.department_id == carBattery || r.category_id == subBooferbox
      )
    ) {
      BAD_REQUEST(
        res,
        "Shipping is not possible for this order please select local pickup"
      );
      return;
    }

    const data = await calculateShipping(shipping_address, products);

    SUCCESS_RESPONSE(res, RECORD_GET_MSG, { data: data });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const placeOrder = async (
  shippingAddress: any,
  user_detail: any,
  billing_address: any,
  products: Product[],
  payment_method: string,
  discount: any,
  selectedShipping: any,
  deviceDetails: any
): Promise<any> => {
  let shipping_charge =
    discount?.is_shipping_free == 1
      ? 0
      : await calculateShipping(shippingAddress, products);

 

  if (selectedShipping == LOCAL_PICKUP) {
    shipping_charge = 0;
  }
  let user;
  let totalAmount: number;
  let discountValue = 0;
  let couponDiscount = 0;
  if (discount?.coupon_code > 0) {
    discountValue = Number(discountValue) + Number(discount?.coupon_code);
    couponDiscount = Number(discount?.coupon_code);
  }

  if (!user_detail) {
    user = await User.findOne({
      where: {
        [Op.or]: [
          { email: billing_address?.email },
          { phone: billing_address?.phone },
        ],
        status: { [Op.eq]: STATUS.active },
      },

      attributes: ["id", "name", "email","last_name", "phone", "country"],
    });

    const hashedPassword = await bcrypt.hash(DEFAULD_PASSWORD, 10);

    if (!user) {
      user = await User.create({
        email: billing_address?.email,
        phone: billing_address?.phone,
        name: billing_address?.name,
        last_name: billing_address?.last_name,
        country: billing_address?.country,
        role: ROLES?.customer,
        password: hashedPassword,
      });
    }

    let address = await BillingAddress.findOne({
      where: {
        postcode: { [Op.eq]: billing_address.postcode },
        status: { [Op.eq]: STATUS.active },
        user_id: { [Op.eq]: user?.id },
      },
    });
    if (!address) {
      address = await BillingAddress.create({
        email: billing_address.email,
        phone: billing_address?.phone,
        name: billing_address?.name,
        country: billing_address?.country,
        city: billing_address?.city,
        state: billing_address?.state,
        postcode: billing_address?.postcode,
        street_address: billing_address?.street_address,
        last_name: billing_address?.last_name,
        user_id: user?.id,
        // role: ROLES.customer,
        // password: hashedPassword,
      });
    }
  } else {
    user = await User.findOne({
      where: {
        id: user_detail.id,
      },
      attributes: ["id", "name", "last_name", "email", "phone", "country"],
    });
  }
  const sub_total = calculateSubTotal(products);
  totalAmount =
    Number(sub_total) + Number(shipping_charge) - Number(discountValue);
    const offset = 10 * 60; // For UTC+11 (Sydney with daylight saving)
    const ausTime = new Date(new Date().getTime() + offset * 60 * 1000);
  const order = await Order.create({
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
    device_detail: deviceDetails || {},
    created_at:ausTime,
    updated_at:ausTime
  });
 

  return { user, order };
};

export const confirmPayment = async (
  paymentDetail: any,
  order: any
): Promise<void> => {
  try {
    const updated = await Order.update(
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

const couponCalculation = async (code: any, products: any[], ship_address: any) => {
  const coupon = await Coupon.findOne({
    where: {
      code,
      status: STATUS.active,
      activate: COUPEN_ACTIVATE.YES,
      [Op.or]: [
        { coupon_apply_for_all_time: COUPEN_APPLY_FOR_ALL_TIME.YES },
        {
          from: { [Op.lte]: new Date() },
          to: { [Op.gte]: new Date() },
        },
      ],
    },
  });

  if (!coupon) {
    return { success: false };
  }

  const validateCategory = (): boolean => {
    const { category_validation, categories, products: allowedProducts, department_ids } = coupon as any;

    switch (category_validation) {
      case COUPEN_CATEGORY_VALIDATION.category:
        return products.some(p => categories.includes(p.category_id));
      case COUPEN_CATEGORY_VALIDATION.product:
        return products.some(p => allowedProducts.includes(p.product_id));
      case COUPEN_CATEGORY_VALIDATION.department:
        return products.some(p => department_ids.includes(p.department_id));
      case COUPEN_CATEGORY_VALIDATION.all:
        return true;
      default:
        return false;
    }
  };

  if (!validateCategory()) {
    return { success: false };
  }

  const couponType = (coupon as any).coupon_type;
  const minPrice = (coupon as any).minimum_price;

  // ---------- 🎁 Free Product ----------
  if (couponType === COUPEN_TYPE.product) {
  const freeProductId = (coupon as any).free_product;

  // ✅ Check if free product is already in cart
  const alreadyInCart = products.some(p => p.product_id === freeProductId);

  // ✅ Apply only if free product not in cart and subtotal is valid
  if (!alreadyInCart) {
    const subTotal = calculateSubTotal(products);
    if (subTotal >= minPrice) {
      const product = await ProductModel.findOne({ where: { id: freeProductId } });
      if (product) {
        return {
          success: true,
          coupon_type: COUPEN_TYPE.product,
          product,
           message: "coupon code is applied"
          // You can use this info to add it on frontend
        };
      }
    }
  }
  return {
    success: false,
    message: "coupon code is already applied",
  };
}

  // ---------- 🚚 Free Shipping ----------
  if (couponType === COUPEN_TYPE.free_shiipping) {
    const subTotal = calculateSubTotal(products);
    if (subTotal >= minPrice) {
      return {
        success: true,
        coupon_type: COUPEN_TYPE.free_shiipping,
      };
    }
    return { success: false };
  }

  // ---------- 💸 Discount ----------
 if (couponType === COUPEN_TYPE.discount) {
  const {
    products: allowedProducts,
    is_on_discounted_product,
    price_validation,
    up_discount_value,
    discount_value,
    discount_type,
    category_validation,
    categories,
    department_ids,
  } = coupon as any;

  // ✅ Filter eligible products based on category_validation
  let eligibleProducts: any[] = [];

  switch (category_validation) {
    case COUPEN_CATEGORY_VALIDATION.product:
      eligibleProducts = products.filter(p => allowedProducts.includes(p.product_id));
      break;

    case COUPEN_CATEGORY_VALIDATION.category:
      eligibleProducts = products.filter(p => categories.includes(p.category_id));
      break;

    case COUPEN_CATEGORY_VALIDATION.department:
      eligibleProducts = products.filter(p => department_ids.includes(p.department_id));
      break;

    case COUPEN_CATEGORY_VALIDATION.all:
      eligibleProducts = products;
      break;

    default:
      eligibleProducts = [];
  }

  if (!eligibleProducts.length) {
    return {
      success: false,
      message: "Coupon not applicable to selected products.",
    };
  }

  const subTotal = is_on_discounted_product === COUPEN_APPLY_ON_DISCOUNTED_PRODUCT.YES
    ? calculateSubTotal(eligibleProducts)
    : calculateSubTotalWithoutDiscount(eligibleProducts);

  let discount;
  if (price_validation === COUPEN_PRICE_VALIDATION.based_on_price) {
    discount = subTotal > minPrice ? up_discount_value : discount_value;
  } else {
    if (subTotal <= minPrice) {
      return { success: false };
    }
    discount = discount_value;
  }

  if (discount_type === COUPEN_DISCOUNT_TYPE.parcentage) {
    discount = percentage(discount, subTotal);
  }

  return {
    success: true,
    coupon_type: COUPEN_TYPE.discount,
    discount,
    applied_on: eligibleProducts.map(p => p.product_id),
  };
}


  return { success: false };
};


const percentage = (value: number, total: number) => (value /100 ) * total;

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

export const addCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, gift_code, products, ship_address } = req.body;
    
    let result;
    if (code) {
      const coupon = await couponCalculation(code, products, ship_address);
      console.log(  "this is coupon code ",coupon)
      let msg;
      console.log(coupon);
      if (coupon?.success) {
        msg = coupon.message ||  "coupon code is already applied";
      } else {
        msg = coupon.message;
        BAD_REQUEST(res, msg);
        return;
      }

      if (coupon.coupon_type == COUPEN_TYPE.discount) {
        result = {
          coupon_type: coupon.coupon_type,
          coupon_applied: 1,
          coupon_code: coupon.discount,
          gift_card: 0,
          is_shipping_free: 0,
        };
      }

      if (coupon.coupon_type == COUPEN_TYPE.free_shiipping) {
        if (ship_address?.country.iso2 != "AU") {
          msg = "Free shipping is not applied on outside australia";
          BAD_REQUEST(res, msg);
          return;
        }

        result = {
          coupon_type: coupon.coupon_type,
          coupon_applied: 1,
          coupon_code: 0,
          gift_card: 0,
          is_shipping_free: 1,
        };
      }
      if (coupon.coupon_type == COUPEN_TYPE.product) {
        result = {
          coupon_type: coupon.coupon_type,
          coupon_applied: 1,
          coupon_code: 0,
          gift_card: 0,
          is_shipping_free: 1,
          product: coupon.product,
        };
      }

      console.log("result==",result);
      
      RECORD_FETCHED_RESPONSE(res, msg, {
        result: result,
      });
    }

    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};
