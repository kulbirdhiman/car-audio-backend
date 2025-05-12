import { Request, Response } from "express";
import { col, fn, literal, Op, Sequelize } from "sequelize";
import {
  RECORD_FETCHED_RESPONSE,
  SERVER_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from "../helper/apiResponse";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  ROLES,
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
import User from "../models/User";

// myOrder
export const statsForDashboard = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    let {
      this_year,
      this_month,
      last_month,
      last_seven_days,
      custom,
      start_date,
      end_date,
      today
    } = req.query;

    let startDate: Date | null = null;
    let endDate: Date = new Date();

   
if (this_year) {
  startDate = new Date(Date.UTC(new Date().getFullYear(), 0, 1));
  endDate = new Date(Date.UTC(new Date().getFullYear(), 11, 31, 23, 59, 59, 999));
}
else if (today) {
  const now = new Date();
  startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
} 
else if (this_month) {
  startDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1));
  endDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999));
} else if (last_month) {
  startDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() - 1, 1));
  endDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 0, 23, 59, 59, 999));
} else if (last_seven_days) {
  startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - 7);
  startDate.setUTCHours(0, 0, 0, 0);
  endDate = new Date();
  endDate.setUTCHours(23, 59, 59, 999);
} else if (custom && start_date && end_date) {
  startDate = new Date(start_date as string);
  endDate = new Date(end_date as string);
  
  // Ensure they are treated as UTC
  startDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
  endDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 23, 59, 59, 999));
}

    let days = startDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

    const queryConditions: any = {
      status: {
        [Op.notIn]: [
          ORDER_STATUS.canceled,
          ORDER_STATUS.returned,
          ORDER_STATUS.trashed,
        ],
      },
      payment_status: PAYMENT_STATUS.paid,
    };

    if (startDate) {
      queryConditions.created_at  = {
        [Op.between]: [startDate, endDate],
      };
    }

    const userCondition: any = {
      status: STATUS.active,
      role: ROLES.customer,
    };

    const order_count = await Order.count({ where: queryConditions });
    const sale = await Order.sum("total_paid_value", {
      where: queryConditions,
    });
    const shipping_charge = await Order.sum("shipping_charge", {
      where: queryConditions,
    });
    const total_user = await User.count({ where: userCondition });

    const minDateRecord = await Order.findOne({
      where: {
        payment_status: PAYMENT_STATUS.paid,
        created_at: {
          [Op.gte]: startDate, // Find the first order on or after startDate
        },
      },
      order: [["created_at", "ASC"]],
      attributes: ["created_at"],
    });

    const maxDateRecord = await Order.findOne({
      where: {
        payment_status: PAYMENT_STATUS.paid,
        created_at: {
          [Op.lte]: endDate, // Find the first order on or after startDate
        },
      },
      order: [["created_at", "DESC"]],
      attributes: ["created_at"],
    });

    if (minDateRecord && maxDateRecord) {
      const adjustedStartDate = new Date(minDateRecord.created_at);
      const adjustedEndDate = new Date(maxDateRecord.created_at);
    
        days =
        Math.ceil(
          (adjustedEndDate.getTime() - adjustedStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1; // +1 to include both start and end dates
    
      console.log(`Days count: ${days}`);
    }
    

    const result = {
      totalOrders: order_count,
      totalSales: sale,
      totalUsers: total_user,
      shippingCharges: shipping_charge,
      days: days,
    };

    RECORD_FETCHED_RESPONSE(res, "Records fetched successfully", { result });
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const saleGraph = async (req: Request, res: Response): Promise<void> => {
  try {
    let {
      this_year,
      this_month,
      last_month,
      last_seven_days,
      custom,
      start_date,
      end_date,
      today
    } = req.query;

    let startDate: Date | null = null;
    let endDate: Date = new Date();

    if (this_year) {
      startDate = new Date(Date.UTC(new Date().getFullYear(), 0, 1));
    } else if (this_month) {
      startDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1));
    } else if (last_month) {
      startDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() - 1, 1));
      endDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 0));
    } else if (last_seven_days) {
      startDate = new Date();
      startDate.setUTCDate(startDate.getUTCDate() - 7);
      startDate.setUTCHours(0, 0, 0, 0);
    }else if (today) {
      startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setUTCHours(23, 59, 59, 999);
    }
    else if (custom && start_date && end_date) {
      startDate = new Date(start_date as string);
      endDate = new Date(end_date as string);
     
      
      // endDate.setHours(23, 59, 59, 999);
    }
    // Ensure startDate is never null
    
    startDate = startDate ?? new Date();
    endDate.setDate(endDate.getDate() + 1);
    // Determine grouping dynamically
    const groupBy = getGroupingInterval(startDate, endDate);
    console.log("groupBy", endDate);

    // Apply date filter
    const queryConditions: any = {
      status: {
        [Op.notIn]: [
          ORDER_STATUS.canceled,
          ORDER_STATUS.returned,
          ORDER_STATUS.trashed,
        ],
      },
      payment_status: PAYMENT_STATUS.paid,
      // created_at: { [Op.between]: [startDate, endDate] },
      created_at: {
        [Op.gte]: fn("DATE", startDate), // Converts startDate to DATE (ignores time)
        [Op.lte]: fn("DATE", endDate),   // Converts endDate to DATE (ignores time)
      },
    };

    // Fetch sales data with dynamic grouping
    const salesData = await Order.findAll({
      attributes: [
        [fn(groupBy.fn, col("created_at"), groupBy.format), "date"], // ✅ Dynamic grouping
        [fn("SUM", col("total_paid_value")), "total_sales"],
      ],
      where: queryConditions,
      group: [fn(groupBy.fn, col("created_at"), groupBy.format)], // ✅ Group by dynamic interval
      order: [[fn(groupBy.fn, col("created_at"), groupBy.format), "ASC"]], // ✅ Order correctly
      raw: true,
    });

    // Format response
    RECORD_FETCHED_RESPONSE(res, "Sales data retrieved successfully", {
      result: {
        dates: salesData.map((entry: any) => entry.date),
        sales: salesData.map((entry: any) => parseFloat(entry.total_sales)),
      },
    });
  } catch (error) {
    console.error("Error fetching sales graph:", error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// ✅ Helper function for dynamic grouping
const getGroupingInterval = (startDate: Date, endDate: Date) => {
  const diffDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays > 365) return { fn: "DATE_FORMAT", format: "%Y" }; // Group by year
  if (diffDays > 90) return { fn: "DATE_FORMAT", format: "%b %Y" }; // Group by month (e.g., "Jan 2025")
  if (diffDays > 7) return { fn: "DATE_FORMAT", format: "%Y-%m-%d" }; // Group by day
  return { fn: "DATE_FORMAT", format: "%Y-%m-%d" }; // Group by day
  // Default: Group by date
};
