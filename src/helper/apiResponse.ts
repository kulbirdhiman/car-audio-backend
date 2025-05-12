import { Response } from "express";
import { generatePagination } from "./commonFunction";

/**
 * ✅ Standard API Responses Helper
 */

interface ResponseData {
  success: boolean;
  message: string;
  data?: any;
  errors?: any[];
  error?: string;
}

const SUCCESS_RESPONSE = (
  res: Response,
  message: string = "Success",
  data: any = null
): Response => {
  const response: ResponseData = {
    success: true,
    message,
    data,
  };
  return res.status(200).json(response);
};

const RECORD_FETCHED_RESPONSE = (
  res: Response,
  message: string = "Record fetched successfully",
  data: any = null
): Response => {
  const response: ResponseData = {
    success: true,
    message,
    data,
  };
  return res.status(200).json(response);
};

const BAD_REQUEST = (
  res: Response,
  message: string = "Bad Request",
  errors: any[] = []
): Response => {
  const response: ResponseData = {
    success: false,
    message,
    errors,
  };
  return res.status(400).json(response);
};

const UNAUTHORIZED_RESPONSE = (
  res: Response,
  message: string = "Unauthorized"
): Response => {
  const response: ResponseData = {
    success: false,
    message,
  };
  return res.status(401).json(response);
};

const FORBIDDEN_RESPONSE = (
  res: Response,
  message: string = "Forbidden"
): Response => {
  const response: ResponseData = {
    success: false,
    message,
  };
  return res.status(403).json(response);
};

const NOT_FOUND_RESPONSE = (
  res: Response,
  message: string = "Not Found"
): Response => {
  const response: ResponseData = {
    success: false,
    message,
  };
  return res.status(404).json(response);
};

const SERVER_ERROR_RESPONSE = (
  res: Response,
  error: string = "Internal Server Error"
): Response => {
  console.error("❌ Server Error:", error);
  const response: ResponseData = {
    success: false,
    message: "Internal Server Error",
    error: error || "",
  };
  return res.status(500).json(response);
};

const DUPLICATE_RECORD_RESPONSE = (
  res: Response,
  field: string,
  errors: any[] = [],
  message: string = ""
): Response => {
  const response: ResponseData = {
    success: false,
    message: message || `${field} is duplicate`,
    errors,
  };
  return res.status(400).json(response);
};

const RECORDWITH_PAGINATION_FETCHED_RESPONSE = (
  res: Response,
  message: string = "Record fetched successfully",
  rows: any = null,
  page: number,
  count: number,
  limit: number
): Response => {
  var pagination = generatePagination(page, count, limit);
  const response: ResponseData = {
    success: true,
    message,
    data: {
      result: rows,
      totalRecords: pagination.totalRecords,
      showPagination: pagination.showPagination,
      totalPage: Math.ceil(pagination.totalRecords / limit),
    },
  };
  return res.status(200).json(response);
};

export {
  SUCCESS_RESPONSE,
  RECORD_FETCHED_RESPONSE,
  BAD_REQUEST,
  UNAUTHORIZED_RESPONSE,
  FORBIDDEN_RESPONSE,
  NOT_FOUND_RESPONSE,
  SERVER_ERROR_RESPONSE,
  DUPLICATE_RECORD_RESPONSE,
  RECORDWITH_PAGINATION_FETCHED_RESPONSE
};
