import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { authenticateUser } from "../middlewares/auth";
import { createRedirectUrl, deleteRedirectUrl, editRedirectUrl, listRedirectUrl } from "../controllers/redirectUrl";

const router = express.Router();

//detail
router.post(
  "/add",
  authenticateUser,
  [
    body("source").notEmpty().withMessage("Source is required"),

    body("destination").notEmpty().withMessage("destination is required"),
  ],
  validateRequest,
  createRedirectUrl
);
//detail
router.get(
  "/list",
  authenticateUser,
 
  validateRequest,
  listRedirectUrl
);

//detail
router.put(
  "/edit/:redirect_url_id",
  authenticateUser,
  [
    body("source").notEmpty().withMessage("Source is required"),

    body("destination").notEmpty().withMessage("destination is required"),
  ],
  validateRequest,
  editRedirectUrl
);


//edit
router.put(
  "/delete/:redirect_url_id",
  authenticateUser,

  validateRequest,
  deleteRedirectUrl
);
export default router;
