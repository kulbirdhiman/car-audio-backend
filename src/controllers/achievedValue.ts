import { Request, Response } from "express";
import { col, fn, Op, Sequelize } from "sequelize";
import {
  DUPLICATE_RECORD_RESPONSE,
  RECORDWITH_PAGINATION_FETCHED_RESPONSE,
  SERVER_ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from "../helper/apiResponse";
import {
  recordCreatedMsg,
  recordDeletedMsg,
  recordUpdatedMsg,
} from "../helper/commonFunction";
import { AuthenticatedRequest } from "../interfaces/auth";
import { ORDER_STATUS, PAYMENT_STATUS, SALE_TARGET_TYPE, STATUS } from "../helper/constant";
import { RECORD_GET_MSG } from "../helper/successMessages";
import RedirectUrl from "../models/RedirectUrl";
import SaleTarget from "../models/SaleTarget";
import AchievedValue from "../models/AchievedValue";
import Order from "../models/Order";
 
// Create a user
export const createAchievedValue = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { ebay, wholesale, walk_in, on_date } = req.body;
    const { id } = req.user!;

    const existing = await AchievedValue.findOne({
      where: {
        on_date: { [Op.eq]: on_date },
      },
    });

    if (existing) {
      console.log("existing====-", existing);

      DUPLICATE_RECORD_RESPONSE(res, "Target sale");
      return;
    }

    await AchievedValue.create({
      ebay,
      wholesale,
      walk_in,
      on_date,
    });

    const msg = recordCreatedMsg("Achieved value");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// list
export const listAchievedSale = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const queryConditions: any = { status: STATUS.active };

    const { rows, count } = await AchievedValue.findAndCountAll({
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

    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// edit
export const editSaleAchieved = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { sale_value_id } = req.params;
    const { ebay, wholesale, walk_in, on_date } = req.body;

    const existing = await AchievedValue.findOne({
      where: {
        on_date: { [Op.eq]: on_date },
        id: {
          [Op.ne]: sale_value_id,
        },
      },
    });

    if (existing) {
      console.log("existing", existing);

      DUPLICATE_RECORD_RESPONSE(res, "Target sale");
      return;
    }

    // Update the sale target
    await AchievedValue.update(
      {
        ebay,
        wholesale,
        walk_in,
        on_date,
      },
      { where: { id: sale_value_id } }
    );

    const msg = recordUpdatedMsg("  Sale achieved");
    SUCCESS_RESPONSE(res, msg);
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

// delete

export const deleteSaleAchieved = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.user!;
    const { sale_value_id } = req.params;

    await AchievedValue.update(
      { status: STATUS.delete, deleted_at: new Date() },
      { where: { id: sale_value_id } }
    );

    const msg = recordDeletedMsg("Sale achieved");
    SUCCESS_RESPONSE(res, msg);
  } catch (error) {
    console.error(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

 
export const getSaleValue = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const type = req.query.type as string | undefined;
  
      if (!type) {
        res.status(400).json({ message: "Missing 'type' parameter" });
        return;
      }
  
      const valueType = parseInt(type);
      const currentDate = new Date();
      console.log("currentDate==",currentDate);
      
      let startDate: Date;

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
  
      if (valueType === SALE_TARGET_TYPE.daily) {
        startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);
        console.log("startDate-===",startDate);
        
      } else if (valueType === SALE_TARGET_TYPE.weekly) {
        startDate = new Date(currentDate);
        const day = startDate.getDay(); // 0 (Sun) - 6 (Sat)
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
        startDate.setDate(diff);
        startDate.setHours(0, 0, 0, 0);
      } else if (valueType === SALE_TARGET_TYPE.monthly) {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      } else if (valueType === SALE_TARGET_TYPE.yearly) {
        startDate = new Date(currentDate.getFullYear(), 0, 1);
      } else {
        res.status(400).json({ message: "Invalid 'type' parameter" });
        return;
      }
      queryConditions.created_at = {
        [Op.gte]: startDate 
      }
  
      const sale = await Order.sum("total_paid_value", {
        where: queryConditions,
      });
      const result = await AchievedValue.findOne({
        attributes: [
          [fn('SUM', col('ebay')), 'total_ebay'],
          [fn('SUM', col('wholesale')), 'total_wholesale'],
          [fn('SUM', col('walk_in')), 'total_walk_in'],
        ],
        where: {
          on_date: {
            [Op.gte]: startDate,
          },
        },
      });
  
      const safeResult = {
        ebay: Number((result as any)?.dataValues?.total_ebay) || 0,
        wholesale: Number((result as any)?.dataValues?.total_wholesale) || 0,
        walk_in: Number((result as any)?.dataValues?.total_walk_in) || 0,
        retail : sale || 0
      };
       
      
      SUCCESS_RESPONSE(res, RECORD_GET_MSG, { result :safeResult  });
    } catch (error) {
      console.error(error);
      SERVER_ERROR_RESPONSE(res);
    }
  };
  
