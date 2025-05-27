// import express from "express";
// import { body, query } from "express-validator";
// import validateRequest from "../middlewares/validateRequest";
// import { authenticateUser } from "../middlewares/auth";
// // import {
// //   createSaleTarget,
// //   deleteSaleTarget,
// //   editSaleTarget,
// //   getSaleTargets,
// //   listSaleTargets,
// // } from "../controllers/SaleTarget";
// import { createAchievedValue, deleteSaleAchieved, editSaleAchieved, getSaleValue, listAchievedSale } from "../controllers/achievedValue";

// const router = express.Router();
// // sale_target

// //add
// router.post(
//   "/add",
//   authenticateUser,
//   [
//     body("ebay").notEmpty().withMessage("Ebay target  is required"),
//     body("wholesale").notEmpty().withMessage("Wholesale target  is required"),
//     body("walk_in").notEmpty().withMessage("Walk in target  is required"),
//       body("on_date")
//       .notEmpty()
//       .withMessage(" date is required")
//       .isISO8601()
//       .withMessage("date must be a valid date"),
   
//   ],
//   validateRequest,
//   createAchievedValue
// );

// //detail
// router.get(
//     "/list",
//     authenticateUser,
   
//     validateRequest,
//     listAchievedSale
//   );


// //   edit

//   router.post(
//     "/edit/:sale_value_id",
//     authenticateUser,
//     [
//       body("ebay").notEmpty().withMessage("Ebay sale  is required"),
//       body("wholesale").notEmpty().withMessage("Wholesale sale  is required"),
//       body("walk_in").notEmpty().withMessage("Walk in sale  is required"),
//         body("on_date")
//         .notEmpty()
//         .withMessage(" date is required")
//         .isISO8601()
//         .withMessage("date must be a valid date"),
     
//     ],
//     validateRequest,
//     editSaleAchieved
//   );

//   //edit
// router.put(
//     "/delete/:sale_value_id",
//     authenticateUser,
//     validateRequest,
//     deleteSaleAchieved
//   );

//   router.get(
//     "/get",
//     query("type").notEmpty().withMessage("Type is required"),
//     // authenticateUser,
//     validateRequest,
//     getSaleValue
//   );
   
// export default router;
