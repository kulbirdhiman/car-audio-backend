// import { Request, Response } from "express";
// import { col, fn, Op, Sequelize } from "sequelize";
// import {
//   DUPLICATE_RECORD_RESPONSE,
//   RECORDWITH_PAGINATION_FETCHED_RESPONSE,
//   SERVER_ERROR_RESPONSE,
//   SUCCESS_RESPONSE,
// } from "../helper/apiResponse";
// import {
//   recordCreatedMsg,
//   recordDeletedMsg,
//   recordUpdatedMsg,
// } from "../helper/commonFunction";
// import { AuthenticatedRequest } from "../interfaces/auth";
// import { STATUS } from "../helper/constant";
// import { RECORD_GET_MSG } from "../helper/successMessages";
// import RedirectUrl from "../models/RedirectUrl";
// // import SaleTarget from "../models/SaleTarget";

// // Create a user
// export const createSaleTarget = async (
//   req: AuthenticatedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { ebay, wholesale, retail, walk_in, start_date, end_date, type } =
//       req.body;
//     const { id } = req.user!;

//     const existing = await SaleTarget.findOne({
//       where: {
//         type: type,
//         end_date: { [Op.gte]: start_date },
//       },
//     });

//     if (existing) {
//       console.log("existing====-",existing);
      
//       DUPLICATE_RECORD_RESPONSE(res, "Target sale");
//       return
//     }

//     await SaleTarget.create({
//       ebay,
//       wholesale,
//       retail,
//       walk_in,
//       start_date,
//       end_date,
//       type,
//     });

//     const msg = recordCreatedMsg("Target sale");
//     SUCCESS_RESPONSE(res, msg);
//     return;
//   } catch (error) {
//     console.log(error);
//     SERVER_ERROR_RESPONSE(res);
//   }
// };

// // list
// export const listSaleTargets = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const page = Number(req.query.page) || 1;
//       const limit = Number(req.query.limit) || 10;
//       const offset = (page - 1) * limit;
      
//       const queryConditions: any = { status: STATUS.active };
   
  
//       const { rows, count } = await SaleTarget.findAndCountAll({
//         where: queryConditions,
//         order: [["id", "DESC"]],
//         limit: limit,
//         offset,
//       });
  
//       RECORDWITH_PAGINATION_FETCHED_RESPONSE(
//         res,
//         RECORD_GET_MSG,
//         rows,
//         page,
//         count,
//         limit
//       );
  
//       return;
//     } catch (error) {
//       console.log(error);
//       SERVER_ERROR_RESPONSE(res);
//     }
//   };

//   // edit
// export const editSaleTarget = async (
//   req: AuthenticatedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { sale_target_id } = req.params;
//     const { ebay, wholesale, retail, walk_in, start_date, end_date, type } = req.body;
    
//     const existing = await SaleTarget.findOne({
//       where: {
//         type: type,
//         end_date: { [Op.gte]: start_date },
//         id: {
//           [Op.ne]: sale_target_id,
//         },
//       },
//     });

//     if (existing) {
//       console.log("existing",existing);
      
//       DUPLICATE_RECORD_RESPONSE(res, "Target sale");
//       return
//     }

    
     

//     // Update the sale target
//     await SaleTarget.update({
//       ebay,
//       wholesale,
//       retail,
//       walk_in,
//       start_date,
//       end_date,
//       type,
//     },
//     { where: { id: sale_target_id } }
//   );



//     const msg = recordUpdatedMsg("Target sale");
//     SUCCESS_RESPONSE(res, msg);
//     return;
//   } catch (error) {
//     console.log(error);
//     SERVER_ERROR_RESPONSE(res);
//   }
// };

// export const getSaleTargets = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const {type} = req.query ;
    
 
//     const currentDate = new Date();

//     const queryConditions: any = { type: type,
//       start_date: { [Op.lte]: currentDate },
//       end_date: { [Op.gte]: currentDate }
//      };


//     const  result = await SaleTarget.findOne({
//       where: queryConditions,
//       order: [['createdAt', 'DESC']],  
//     });

//     const safeResult = {
//       ebay: Number((result as any)?.dataValues?.total_ebay) || 0,
//       wholesale: Number((result as any)?.dataValues?.total_wholesale) || 0,
//       walk_in: Number((result as any)?.dataValues?.total_walk_in) || 0,
//       retail: Number((result as any)?.dataValues?.retail) || 0,
//       // retail : sale || 0
//     };

//     SUCCESS_RESPONSE(res, RECORD_GET_MSG,{result});

//     return;
//   } catch (error) {
//     console.log(error);
//     SERVER_ERROR_RESPONSE(res);
//   }
// };

// export const deleteSaleTarget = async (
//   req: AuthenticatedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.user!;
//     const { sale_target_id } = req.params;

//     await SaleTarget.update(
//       { status: STATUS.delete, deleted_at: new Date()  },
//       { where: { id: sale_target_id } }
//     );

//     const msg = recordDeletedMsg("Sale target");
//     SUCCESS_RESPONSE(res, msg);
//   } catch (error) {
//     console.error(error);
//     SERVER_ERROR_RESPONSE(res);
//   }
// };