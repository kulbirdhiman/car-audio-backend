import express from "express";
import { getUsers, createUser, importUser } from "../controllers/users";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";

const router = express.Router();

router.get("/", getUsers);
router.post(
  "/add",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validateRequest,
  createUser
);

router.post(
  "/import",
  [
    body("user_data").isArray({ min: 1 }).withMessage("User data is required"),
  ],
  validateRequest,
  importUser
);

export default router;
