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
  addNotesInOrder,
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

const router = express.Router();

//list
router.get("/list", authenticateUser, authorizeRoles(ROLES.admin), listOrders);

//list
router.put(
  "/update/:order_id",
  authenticateUser,
  authorizeRoles(ROLES.admin),
  updateOrder
);
//list
router.get(
  "/detail/:order_id",
  authenticateUser,
  authorizeRoles(ROLES.admin),
  orderDetail
);

router.get(
  "/my_orders",
  authenticateUser,
  authorizeRoles(ROLES.customer),
  myOrders
);
router.get("/my_orderspdf", async (req: Request, res: Response) => {
  try {
    const invoiceData: any = {
      user_detail: {
        name: "test",
        last_name: "test",
        email: "karan@yopmail.com",
        phone: "87272978",
        country: { name: "Australia" },
      },
      shipping_address: {
        name: "test",
        last_name: "test",
        street_address: "jkwkj",
        city: "89389",
        state_name: "Northern Territory",
        postcode: "89189",
        country_name: "Australia",
      },
      billing_address: {
        email:"varinder12344@yopmail.com",
        name: "test",
        last_name: "test",
        street_address: "jkwkj",
        city: "89389",
        state_name: "Northern Territory",
        postcode: "89189",
        country_name: "Australia",
      },
      products: [
        {
          name: "0 Gauge Ring Terminals",
          quantity: 1,
          price: 7.5,
          variations: [],
        },
        {
          name: "SatNav for Lexus IS200",
          quantity: 1,
          price: 1395,

          variations: [
            {
              department_ids: [12, 13],
              category_ids: [],
              product_ids: [],
              options: [
                {
                  id: 1741444411534,
                  in_stock: 1,
                  name: "Premium Sound Kit",
                  price: 75,
                },
              ],
            },
          ],
        },
      ],

      sub_total: 1478,
      shipping_charge: 31,
      total_paid_value: 1509,
    };

    const pdfPath = await generateInvoice(invoiceData); // Pass necessary data
    if (pdfPath) {
      res.status(200).json({ error: " generate invoice" });
      // res.download(pdfPath );
    } else {
      res.status(500).json({ error: "Failed to generate invoice" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post(
  "/print_label",
  authenticateUser,
  authorizeRoles(ROLES.admin),
  printLabelForDirectFright
);

//list
router.get("/user/detail/:order_id", authenticateUser, orderDetailForUser);

router.put(
  "/update_shipping/:order_id",
  authenticateUser,
  [
    body("name").notEmpty().withMessage(" First  name is required"),
    body("last_name").notEmpty().withMessage(" Last  name is required"),
    body("email").notEmpty().isEmail().withMessage(" Email is required"),
    body("phone")
      .notEmpty()
      .isNumeric()
      .withMessage(" Phone number is required"),
    body("state").notEmpty().withMessage(" State is required"),
    body("city").notEmpty().withMessage(" City is required"),
    body("street_address")
      .notEmpty()
      .withMessage(" Street address is required"),
    body("country").isObject().notEmpty().withMessage("Country is required"),
    body("postcode").notEmpty().withMessage("Post code is required"),
  ],
  validateRequest,
  authorizeRoles(ROLES.admin),
  updateOrderShipping
);

router.put(
  "/add_notes/:order_id",
  authenticateUser,
  [
    body("notes").notEmpty().withMessage("Notes is required"),
  ],
  validateRequest,
  authorizeRoles(ROLES.admin),
  addNotesInOrder
);

export default router;

// import { Request, Response } from "express";
