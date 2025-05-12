import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { DEPARTMENT_VIEW, ROLES } from "../helper/constant";
import {
  createDepartment,
  deleteDepartment,
  listDepartment,
  upsertDepartment,
} from "../controllers/department";
import { authenticateUser, authorizeRoles } from "../middlewares/auth";
import {
  listOrders,
  myOrders,
  orderDetail,
  orderDetailForUser,
  printLabelForDirectFright,
  updateOrder,
  updateOrderShipping,
} from "../controllers/order";
// import { generateOrderPDF } from "../controllers/test";
import { generateOrderPDF } from "../controllers/orderPdf";
import { generateInvoice } from "../controllers/test";
import { Request, Response } from "express";
import { saleGraph, statsForDashboard } from "../controllers/adminDashboard";

const router = express.Router();

//list
router.get("/stats", authenticateUser, authorizeRoles(ROLES.admin), statsForDashboard);


router.get("/sale_data",   saleGraph);


 export default router