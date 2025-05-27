// import express from "express";
// import { body, query } from "express-validator";
// import validateRequest from "../middlewares/validateRequest";
// import { authenticateUser } from "../middlewares/auth";
// import { createSaleTarget, deleteSaleTarget, editSaleTarget, getSaleTargets, listSaleTargets } from "../controllers/SaleTarget";

// const router = express.Router();
// // sale_target

// //add
// router.post(
//   "/add",
//   authenticateUser,
//   [
//     body("ebay").notEmpty().withMessage("Ebay target  is required"),
//     body("wholesale").notEmpty().withMessage("Wholesale target  is required"),
//     body("retail").notEmpty().withMessage("Retail target  is required"),
//     body("walk_in").notEmpty().withMessage("Walk in target  is required"),
//     body("type").notEmpty().withMessage("Type of target sale   is required"),
//     body("start_date")
//     .notEmpty().withMessage("Start date is required")
//     .isISO8601().withMessage("Start date must be a valid date"),
//   body("end_date")
//     .notEmpty().withMessage("End date is required")
//     .isISO8601().withMessage("End date must be a valid date"),
//   body("start_date").custom((value, { req }) => {
//     const start = new Date(req.body.start_date);
//     const end = new Date(req.body.end_date);
//     if (start >= end) {
//       throw new Error("Start date must be before end date");
//     }
//     return true;
//   })
//   ],
//   validateRequest,
//   createSaleTarget
// );

// //detail
// router.get(
//   "/list",
//   authenticateUser,
 
//   validateRequest,
//   listSaleTargets
// );

// //add
// router.post(
//   "/edit/:sale_target_id",
//   authenticateUser,
//   [
//     body("ebay").notEmpty().withMessage("Ebay target  is required"),
//     body("wholesale").notEmpty().withMessage("Wholesale target  is required"),
//     body("retail").notEmpty().withMessage("Retail target  is required"),
//     body("walk_in").notEmpty().withMessage("Walk in target  is required"),
//     body("type").notEmpty().withMessage("Type of target sale   is required"),
//     body("start_date")
//     .notEmpty().withMessage("Start date is required")
//     .isISO8601().withMessage("Start date must be a valid date"),
//   body("end_date")
//     .notEmpty().withMessage("End date is required")
//     .isISO8601().withMessage("End date must be a valid date"),
//   body("start_date").custom((value, { req }) => {
//     const start = new Date(req.body.start_date);
//     const end = new Date(req.body.end_date);
//     if (start >= end) {
//       throw new Error("Start date must be before end date");
//     }
//     return true;
//   })
//   ],
//   validateRequest,
//   editSaleTarget
// );

// router.get(
//   "/get",
//   query("type").notEmpty().withMessage("Type is required"),
//   authenticateUser,
//   validateRequest,
//   getSaleTargets
// );

// //edit
// router.put(
//   "/delete/:sale_target_id",
//   authenticateUser,
//   validateRequest,
//   deleteSaleTarget
// );
 
 
// export default router;
