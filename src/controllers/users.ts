import { Request, Response } from "express";
import User from "../models/User";
import { validationResult } from "express-validator";
import {
  VALIDATION_ERROR,
  VALIDATION_ERROR_MESSAGE,
} from "../helper/errorsConst";
import { log } from "node:console";
import bcrypt from "bcrypt";
import { BAD_REQUEST, DUPLICATE_RECORD_RESPONSE } from "../helper/apiResponse";
import { ROLES } from "../helper/constant";
import { Op, Sequelize } from "sequelize";
// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Create a user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      DUPLICATE_RECORD_RESPONSE(res, "Email");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      role: ROLES.admin,
      email,
      password: hashedPassword,
    });
    res.status(201).json(user);
    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to create user" });
  }
};

export const importUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role, user_data } = req.body;
    const wrongUser = [];
    for (let user of user_data) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { email: user.user_email },
            {
              [Op.and]: [
                { phone: user.phone },
                { phone: { [Op.ne]: null } },
                Sequelize.where(Sequelize.fn('char_length', Sequelize.col('phone')), '>', 5)
              ]
            }
            
          ]
        }
      });
      
      if (existingUser) {
        wrongUser.push(user)
        continue;
      }
      const pass = "098765@#"
      const hashedPassword = await bcrypt.hash(pass, 10);

      await User.create({
        name:user.first_name,
        last_name:user.last_name,
        role: ROLES.customer,
        email:user.user_email,
        phone:user.phone,
        password: hashedPassword,
      });

    }

   

   
    res.status(201).json(wrongUser);
    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to create user" });
  }
};
