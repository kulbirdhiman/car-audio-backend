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
import { AuthenticatedRequest } from "../interfaces/auth";
import User from "../models/User";
import WholesaleRequest from "../models/WholesaleRequest";
import {
  DEFAULD_PASSWORD,
  ROLES,
  WHOLESALE_REQUEST_STATUS,
} from "../helper/constant";
import {
  RECORD_GET_MSG,
  RECORD_NOT_FOUND,
  RECORD_UPDATED,
  WHOLESALE_REQUEST_SENT,
} from "../helper/successMessages";
import { any } from "square/core/schemas";
import bcrypt from "bcrypt";
import WholeSellerDetail from "../models/WholeSellerDetail";
// Create a user
export const sendWholesaleRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      company_name,
      buisness_trading_name,
      abn_acn,
      website_url,
      country,
      state,
      city,
      street_address,
      postcode,
      phone,
      contact_name,
      account_payable_email,
      name_of_social_media_channel,
      facebook,
      youtube,
      x,
      tiktok,
      last_year_turn_over,
      no_of_employee,
      current_method_of_sales,
      website,
      ebay_and_other_ecommerce_platform,
      shop_photo,
    } = req.body;

    const existingUser = await User.findOne({
      where: { email: account_payable_email },
    });
    const existingEmail = await WholesaleRequest.findOne({
      where: Sequelize.where(
        Sequelize.json("account_payable_email.value") as unknown as any,
        account_payable_email
      ),
    });
    if (existingUser || existingEmail) {
      DUPLICATE_RECORD_RESPONSE(res, "Email");
      return;
    }

    const existingPhone = await User.findOne({
      where: { phone: phone },
    });
    const existingPhoneRequest = await WholesaleRequest.findOne({
      where: Sequelize.where(
        Sequelize.json("phone.value") as unknown as any,
        phone
      ),
    });
    if (existingPhone || existingPhoneRequest) {
      console.log("existingPhone", existingPhone);

      DUPLICATE_RECORD_RESPONSE(res, "Phone");
      return;
    }

    const user = await WholesaleRequest.create({
      company_name: formatField(company_name),
      buisness_trading_name: formatField(buisness_trading_name),
      abn_acn: formatField(abn_acn),
      website_url: formatField(website_url),
      country: formatField(country),
      state: formatField(state),
      city: formatField(city),
      postcode: formatField(postcode),
      street_address: formatField(street_address),
      phone: formatField(phone),
      contact_name: formatField(contact_name),
      account_payable_email: formatField(account_payable_email),
      name_of_social_media_channel: formatField(name_of_social_media_channel),
      facebook: formatField(facebook),
      youtube: formatField(youtube),
      x: formatField(x),
      tiktok: formatField(tiktok),
      last_year_turn_over: formatField(last_year_turn_over),
      no_of_employee: formatField(no_of_employee),
      current_method_of_sales: formatField(current_method_of_sales),
      website: formatField(website),
      ebay_and_other_ecommerce_platform: formatField(
        ebay_and_other_ecommerce_platform
      ),
      shop_photo: formatField(shop_photo),
    });

    const msg = WHOLESALE_REQUEST_SENT;
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

const formatField = (value: any) => {
  return {
    value: value,
    status: WHOLESALE_REQUEST_STATUS.pending,
  };
};

export const listWholesaleRequest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await WholesaleRequest.findAndCountAll({
      where: {},
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

    return;
  } catch (error) {
    // console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const listOneWholesaleRequest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { uuid } = req.params;

    const result = await WholesaleRequest.findOne({
      where: { uuid: uuid },
    });

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });

    return;
  } catch (error) {
    // console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const updateFieldOfRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uuid } = req.params;
    const { field_name, status, description } = req.body;

    const result = await WholesaleRequest.findOne({ where: { uuid } });

    if (!result) {
      SERVER_ERROR_RESPONSE(res, RECORD_NOT_FOUND);
      return;
    }

    // Check if the field exists in the result
    if (!(field_name in result)) {
      SERVER_ERROR_RESPONSE(res, `Field '${field_name}' not found in request.`);
      return;
    }

    // Update only the dynamic field
    (result as any)[field_name] = {
      ...(result as any)[field_name],
      status,
      description,
    };

    await result.save();

    const msg = RECORD_UPDATED;
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const updateRequestStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uuid } = req.params;
    const { status, description } = req.body;
    let requestStatus = true;
    const result = await WholesaleRequest.findOne({ where: { uuid } });

    if (!result) {
      SERVER_ERROR_RESPONSE(res, RECORD_NOT_FOUND);
      return;
    }

    const checkStatus = [
      "company_name",
      "buisness_trading_name",
      "abn_acn",
      "website_url",
      "city",
      "street_address",
      "postcode",
      "phone",
      "contact_name",
      "account_payable_email",
      "name_of_social_media_channel",
      "facebook",
      "youtube",
      "x",
      "tiktok",
      "last_year_turn_over",
      "no_of_employee",
      "current_method_of_sales",
      "website",
      "ebay_and_other_ecommerce_platform",
      "shop_photo",
      "country",
      "state",
    ];
    Object.entries(result?.dataValues).map(([key, field]) => {
      if (checkStatus.includes(key)) {
        const parsedField = JSON.parse(field as any);
        if (parsedField.value) {
          if (parsedField.status != WHOLESALE_REQUEST_STATUS.approved) {
            requestStatus = false;
          }
        }
      }
    });

    if (status == WHOLESALE_REQUEST_STATUS.approved && !requestStatus) {
      BAD_REQUEST(
        res,
        "You can accept request only after accept all the field"
      );
      return;
    }

    if (status == WHOLESALE_REQUEST_STATUS.rejected && requestStatus) {
      BAD_REQUEST(
        res,
        "You can reject  request only if tlease on field is not acceped"
      );
      return;
    }

    if (status == WHOLESALE_REQUEST_STATUS.approved && requestStatus) {
      const hashedPassword = await bcrypt.hash(DEFAULD_PASSWORD, 10);

      const user = await User.create({
        name: JSON.parse(result?.dataValues?.contact_name).value,
        role: ROLES.wholesaler,
        email: JSON.parse(result?.dataValues?.account_payable_email).value,
        country: JSON.parse(result?.dataValues?.country).value,
        phone: JSON.parse(result?.dataValues?.phone).value,
        password: hashedPassword,
      });

      await WholesaleRequest.update(
        {
          status,
          user_id: user.id,
        },
        {
          where: { uuid: uuid },
        }
      );

      await WholeSellerDetail.create({
        user_id: user.id,
        contact_name: JSON.parse(result?.dataValues?.contact_name).value,
        company_name: JSON.parse(result?.dataValues?.company_name).value,
        buisness_trading_name: JSON.parse(
          result?.dataValues?.buisness_trading_name
        ).value,
        abn_acn: JSON.parse(result?.dataValues?.abn_acn).value,
        website_url: JSON.parse(result?.dataValues?.website_url).value,
        country: JSON.parse(result?.dataValues?.country).value,
        state: JSON.parse(result?.dataValues?.state).value,
        city: JSON.parse(result?.dataValues?.city).value,
        street_address: JSON.parse(result?.dataValues?.street_address).value,
        postcode: JSON.parse(result?.dataValues?.postcode).value,
        phone: JSON.parse(result?.dataValues?.phone).value,
        name_of_social_media_channel: JSON.parse(
          result?.dataValues?.name_of_social_media_channel
        ).value,
        account_payable_email: JSON.parse(
          result?.dataValues?.account_payable_email
        ).value,
        facebook: JSON.parse(result?.dataValues?.facebook).value,
        youtube: JSON.parse(result?.dataValues?.youtube).value,
        x: JSON.parse(result?.dataValues?.x).value,
        tiktok: JSON.parse(result?.dataValues?.tiktok).value,
        last_year_turn_over: JSON.parse(result?.dataValues?.last_year_turn_over)
          .value,
        no_of_employee: JSON.parse(result?.dataValues?.no_of_employee).value,
        current_method_of_sales: JSON.parse(
          result?.dataValues?.current_method_of_sales
        ).value,
        website: JSON.parse(result?.dataValues?.website).value,
        ebay_and_other_ecommerce_platform: JSON.parse(
          result?.dataValues?.ebay_and_other_ecommerce_platform
        ).value,
        shop_photo: JSON.parse(result?.dataValues?.shop_photo).value,
      });
    }

    await WholesaleRequest.update(
      {
        status,
      },
      {
        where: { uuid: uuid },
      }
    );

    const msg = RECORD_UPDATED;
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const updateMyRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uuid } = req.params;
    const {
      status,
      company_name,
      buisness_trading_name,
      abn_acn,
      website_url,
      country,
      state,
      city,
      street_address,
      postcode,
      phone,
      contact_name,
      account_payable_email,
      name_of_social_media_channel,
      facebook,
      youtube,
      x,
      tiktok,
      last_year_turn_over,
      no_of_employee,
      current_method_of_sales,
      website,
      ebay_and_other_ecommerce_platform,
      shop_photo,
      device_detail,
    } = req.body;
    let requestStatus = true;
    const result = await WholesaleRequest.findOne({ where: { uuid } });

    if (!result) {
      SERVER_ERROR_RESPONSE(res, RECORD_NOT_FOUND);
      return;
    }

    await WholesaleRequest.update(
      {
        status,
        company_name,
        buisness_trading_name,
        abn_acn,
        website_url,
        country,
        state,
        city,
        street_address,
        postcode,
        phone,
        contact_name,
        account_payable_email,
        name_of_social_media_channel,
        facebook,
        youtube,
        x,
        tiktok,
        last_year_turn_over,
        no_of_employee,
        current_method_of_sales,
        website,
        ebay_and_other_ecommerce_platform,
        shop_photo,
        device_detail,
      },
      {
        where: { uuid: uuid },
      }
    );

    const msg = RECORD_UPDATED;
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};
