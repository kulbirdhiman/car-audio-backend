import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import {
  BAD_REQUEST,
  DUPLICATE_RECORD_RESPONSE,
  RECORD_FETCHED_RESPONSE,
  RECORDWITH_PAGINATION_FETCHED_RESPONSE,
  SERVER_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from "../helper/apiResponse";
import {
  COUPEN_ACTIVATE,
  COUPEN_APPLY_FOR_ALL_TIME,
  COUPEN_CATEGORY_VALIDATION,
  COUPEN_TYPE,
  ORDER_STATUS,
  PAYMENT_STATUS,
  SHIPPMENT_METHOD,
  SHIPPMENT_TYPE,
  STANDARD_DELIVERY,
  STATUS,
} from "../helper/constant";
import Department from "../models/Department";
import { generateSlug, recordCreatedMsg } from "../helper/commonFunction";
import { AuthenticatedRequest } from "../interfaces/auth";
import { ORDER_UPDATE_MSG, RECORD_GET_MSG } from "../helper/successMessages";
import Order from "../models/Order";
import axios from "axios";
import { NUMBER } from "sequelize";
import Coupon from "../models/Coupon";

// Create a user
export const listOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, search } = req.query;
    const queryConditions: any = {};

    if (Number(status) > 0 && Number(status) !== ORDER_STATUS.trashed) {
      if (status && Number(status) != ORDER_STATUS.failed_payment) {
        queryConditions.status = status;

        queryConditions.payment_status = PAYMENT_STATUS.paid;
      }

      if (status && Number(status) == ORDER_STATUS.failed_payment) {
        queryConditions.payment_status = PAYMENT_STATUS.pending;
      }
    }

    if (!queryConditions[Op.and]) {
      queryConditions[Op.and] = [];
    }

    if (Number(status) !== ORDER_STATUS.trashed) {
      queryConditions[Op.and].push({
        status: { [Op.ne]: ORDER_STATUS.trashed },
      });
    }

    if (Number(status) > 0 && Number(status) == ORDER_STATUS.trashed) {
      queryConditions.status = ORDER_STATUS.trashed;
    }

    // if (Number(status) == 1) {
    console.log(queryConditions);
    // }
    if (search) {
      queryConditions[Op.and].push({
        [Op.or]: [
          { id: { [Op.like]: `%${search}%` } }, // Search by partial match in ID
          Sequelize.literal(
            `JSON_UNQUOTE(JSON_EXTRACT(user_detail, '$.name')) LIKE '%${search}%'`
          ),
        ],
      });
    }

    const { rows, count } = await Order.findAndCountAll({
      where: queryConditions,
      order: [["id", "DESC"]],
      limit: limit,
      offset,
    });

    RECORDWITH_PAGINATION_FETCHED_RESPONSE(
      res,
      RECORD_GET_MSG,
      rows,
      page,
      count,
      limit
    );

    // RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
    //   result: result,
    // });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ship_method, type, tracking_number, status } = req.body;
    const { order_id } = req.params;
    let result;

    let trackingNumber;
    let labelUrl;
    const orderDetail = await Order.findOne({
      where: { id: order_id },
    });

    if (type == SHIPPMENT_TYPE.manual) {
      if (!tracking_number) {
        BAD_REQUEST(res, "Please enter tracking number.");
        return;
      }
    }

    if (status == ORDER_STATUS.canceled || status == ORDER_STATUS.shipped) {
      if ((orderDetail as any).status != ORDER_STATUS.processing) {
        console.log(orderDetail);

        BAD_REQUEST(res, "Not possible s");
        return;
      }
    }

    if (status == ORDER_STATUS.returned) {
      if ((orderDetail as any).status != ORDER_STATUS.delivered) {
        BAD_REQUEST(res, "Not possible");
        return;
      }
    }

    if (status == ORDER_STATUS.delivered) {
      if (
        (orderDetail as any).status != ORDER_STATUS.shipped &&
        (orderDetail as any).selected_shipment == STANDARD_DELIVERY
      ) {
        BAD_REQUEST(res, "Not possible");
        return;
      }
    }

    if (type == SHIPPMENT_TYPE.manual) {
      trackingNumber = tracking_number;
    } else {
      if (ship_method == SHIPPMENT_METHOD.direct_freight_express) {
        const response = await shipByDirectFrightExpress(orderDetail);

        if (!(response as any)?.data?.ConsignmentList[0]?.Connote) {
          BAD_REQUEST(
            res,
            (response as any)?.data?.ConsignmentList[0]?.ResponseMessage
          );
          return;
        } else {
          // result = response

          labelUrl = (response as any)?.data?.LabelURL;
          trackingNumber = (response as any)?.data?.ConsignmentList[0]?.Connote;
          result = {
            labelUrl: labelUrl,
          };
        }
      }

      if (ship_method == SHIPPMENT_METHOD.australia_post) {
        BAD_REQUEST(res, "automatic not pssible till now");
        return;
      }
    }

    await Order.update(
      {
        labe_url: labelUrl,
        tracking_number: trackingNumber,
        shippment_method: ship_method,
        shippment_type: type,
        status: status,
      },
      { where: { id: order_id } }
    );

    RECORD_FETCHED_RESPONSE(res, ORDER_UPDATE_MSG, { result });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// detail
export const orderDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { order_id } = req.params;

    const result = await Order.findOne({
      where: { id: order_id },
    });

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const shipByDirectFrightExpress = async (order: any) => {
  try {
    const ConsignmentLineItems = order.products.reduce(
      (acc: any, item: any) => {
        return {
          RateType: "ITEM",
          PackageDescription: "Carton of Goods",
          Items: 1,
          height: Math.max(acc.height, item.height || 330),
          width: Math.max(acc.width, item.width || 200),
          length: acc.length + (item.length || 430),
          weight: acc.weight + (item.weight || 4),
          Cubic: 0,
        };
      },
      { height: 0, width: 0, length: 0, weight: 0 }
    );

    console.log("order.shipping_address", order.shipping_address);
    ConsignmentLineItems.Kgs = ConsignmentLineItems.weight;
    ConsignmentLineItems.height = ConsignmentLineItems.height / 10;
    ConsignmentLineItems.width = ConsignmentLineItems.width / 10;
    ConsignmentLineItems.length = ConsignmentLineItems.length / 10;

    const data = {
      ConsignmentList: [
        {
          ConsignmentId: order.id,
          ReceiverDetails: {
            ReceiverName: order.shipping_address.name,
            AddressLine1: 3000, //order.shipping_address.street_address,
            Suburb: formatCityName(order.shipping_address.city),
            Postcode: order.shipping_address.postcode,
            State: order.shipping_address.state.state_code,
            // State:"NSW",
            ReceiverContactName: order.shipping_address.name,
            ReceiverContactMobile: order.shipping_address.phone,
            ReceiverContactEmail: order.shipping_address.email,
          },
          ConsignmentLineItems: [ConsignmentLineItems],
        },
      ],
    };

    const response = await axios.post(
      "https://webservices.directfreight.com.au/Dispatch/api/AddConsignment/",
      data,
      {
        headers: {
          // "Content-Type": "application/json",
          Authorisation: process.env.DIRECT_FRIEGHT_EXPRESS_CONSIGNMENT,
          AccountNumber: process.env.DIRECT_FRIEGHT_EXPRESS_ACCOUNT_NUMBER,
          SiteId: process.env.DIRECT_FRIEGHT_EXPRESS_SITE_ID,
          UserAgent: process.env.DIRECT_FRIGHT_USER_AGENT,
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};

function formatCityName(city: any) {
  if (!city) return "";
  const upCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  console.log(upCity);

  return upCity;
}
// Create a user
export const addCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const queryConditions: any = {};

    const result = await Order.findAll({
      where: queryConditions,
      order: [["id", "DESC"]],
    });

    if (status == "2") {
      console.log(result);
    }

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// myOrder

export const myOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { status } = req.query;
    const queryConditions: any = { user_id: id };

    const result = await Order.findAll({
      where: queryConditions,
      order: [["id", "DESC"]],
    });

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const printLabelForDirectFright = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { cannot } = req.body;

    const data = {
      LabelPrintStatus: "REPRINT",
      ConnoteList: [
        {
          Connote: cannot,
        },
      ],
    };

    const response = await axios.post(
      "https://webservices.directfreight.com.au/Dispatch/api/GetConsignmentLabel/",
      data,
      {
        headers: {
          // "Content-Type": "application/json",
          Authorisation: process.env.DIRECT_FRIEGHT_EXPRESS_CONSIGNMENT,
          AccountNumber: process.env.DIRECT_FRIEGHT_EXPRESS_ACCOUNT_NUMBER,
          SiteId: process.env.DIRECT_FRIEGHT_EXPRESS_SITE_ID,
          UserAgent: process.env.DIRECT_FRIGHT_USER_AGENT,
        },
      }
    );
    console.log(response);
    if (response.data.LabelURL) {
      RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
        result: response.data,
      });
    } else {
      SERVER_ERROR_RESPONSE(res);
    }
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const orderDetailForUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { order_id } = req.params;
    const { id } = req.user!;

    const result = await Order.findOne({
      where: { id: order_id, user_id: id },
    });

    if (result) {
      RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
        result: result,
      });
      return;
    } else {
      SERVER_ERROR_RESPONSE(res);
      return;
    }
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const updateOrderShipping = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      last_name,
      email,
      phone,
      state,
      city,
      street_address,
      country,
      postcode,
    } = req.body;
    const { order_id } = req.params;
    const shippingAddress = {
      name,
      last_name,
      email,
      phone,
      state,
      city,
      street_address,
      country,
      postcode,
    };

    await Order.update(
      {
        shipping_address: shippingAddress,
      },
      { where: { id: order_id } }
    );

    SUCCESS_RESPONSE(res, ORDER_UPDATE_MSG);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const addNotesInOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { notes } = req.body;
    const { order_id } = req.params;

    await Order.update(
      {
        notes: notes,
        note_added_at: new Date()

      },
      { where: { id: order_id } }
    );

    RECORD_FETCHED_RESPONSE(res, ORDER_UPDATE_MSG );
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};
