import express from "express";
import { getUsers, createUser } from "../controllers/users";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { changePassword, myProfile, sendOtp, setPassword, signIn,  signUp, verifyOtp } from "../controllers/auth";
import { authenticateUser } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/sign_in",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validateRequest,
  signIn
);

router.get("/my_profile", authenticateUser, validateRequest, myProfile);

router.post(
  "/sign_up",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
    body("name")
      .isString()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    body("last_name")
      .isString()
      .isLength({ min: 2 })
      .notEmpty()
      .withMessage("Last name must be at least 2 characters long"),
    body("country").isObject().notEmpty().withMessage("Country is required"),
    body("phone").isNumeric().notEmpty().withMessage("phone is required"),
  ],
  validateRequest,
  signUp
);


router.post(
  "/send_otp",
  [
    body("email").isEmail().withMessage("Invalid email format")
  ],
  validateRequest,
  sendOtp
);

router.post(
  "/verify_otp",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("otp").notEmpty().withMessage("Otp is required"),
  ],
  validateRequest,
  verifyOtp
);

router.post(
  "/set_password",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("otp").notEmpty().withMessage("Otp is required"),
    body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  ],
  validateRequest,
  setPassword
);

router.post(
  "/change_password",
  authenticateUser,
  [
    
    body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  ],
  validateRequest,
  changePassword
);

// router.post(
//   "/wholesale_sign_in",
//   [
//     body("email").isEmail().withMessage("Invalid email format"),
//     body("password")
//       .isLength({ min: 6 })
//       .withMessage("Password must be at least 6 characters long"),
//   ],
//   validateRequest,
//   signInWholesale
// );


export default router;
