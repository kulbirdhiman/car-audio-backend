import { Request, Response } from "express";
import User from "../models/User";
import { validationResult } from "express-validator";
import { INCORRECT_PASSWORD, UNREGISTER_EMAIL } from "../helper/errorsConst";
import { log } from "node:console";
import bcrypt from "bcrypt";
import {
  BAD_REQUEST,
  DUPLICATE_RECORD_RESPONSE,
  SUCCESS_RESPONSE,
  UNAUTHORIZED_RESPONSE,
} from "../helper/apiResponse";
import { ROLES, STATUS } from "../helper/constant";
import jwt from "jsonwebtoken";
import {
  LOG_IN_MESSAGE,
  PASSWORD_UPDATE,
  RECORD_GET_MSG,
} from "../helper/successMessages";
import { AuthenticatedRequest } from "../interfaces/auth";
import { sendEmailWithTemplate } from "../helper/commonFunction";
import { Op } from "sequelize";

// Get all users

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    var errorsArray = [];
    const user = await User.findOne({
      where: { email, status: STATUS.active,
        role: {
          [Op.in]: [ROLES.admin, ROLES.customer],
        },
       },
    });

    if (!user) {
      errorsArray.push({
        path: "email",
        message: UNREGISTER_EMAIL,
      });
      BAD_REQUEST(res, UNREGISTER_EMAIL, [{}]);
      return;
    }

    const isMatch = await bcrypt.compare(password, user?.password as string);

    if (!isMatch) {
      UNAUTHORIZED_RESPONSE(res, INCORRECT_PASSWORD);
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    SUCCESS_RESPONSE(res, LOG_IN_MESSAGE, {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to fetch users" });
  }
};

//  my profile

export const myProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req?.user!;

    const user = await User.findOne({
      where: { id, status: STATUS.active },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      UNAUTHORIZED_RESPONSE(res);
      return;
    }

    SUCCESS_RESPONSE(res, RECORD_GET_MSG, {
      user: {
        ...user.dataValues,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// sign up
export const signUp = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      name,
      last_name,
      country,
      phone,
    } = req.body;
    var errorsArray = [];

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      DUPLICATE_RECORD_RESPONSE(res, "Email");
      return;
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      DUPLICATE_RECORD_RESPONSE(res, "Phone");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      role: ROLES.customer,
      email,
      last_name,
      phone,
      country,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    SUCCESS_RESPONSE(res, LOG_IN_MESSAGE, {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      BAD_REQUEST(res, "Email is not existed");
      return;
    }

    const otp = generateOTP();

    await User.update(
      { otp: otp, otp_date: new Date() },
      { where: { id: existingUser.id } }
    );

    const a = {
      otp: otp,
      name: existingUser.name,
    };

    const sender = {
      email: "support@kayhanaudio.com.au",
      name: "Kayhan Audio",
    };
    await sendEmailWithTemplate(
      existingUser.email,
      existingUser.name,
      a,
      3,
      sender
    );

    SUCCESS_RESPONSE(res, " OTP verified successfully");
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      BAD_REQUEST(res, "Email is not existed");
      return;
    }

    if ((existingUser as any).otp == otp) {
      SUCCESS_RESPONSE(res, "Send OTP successfully");
    } else {
      BAD_REQUEST(res, "Wrong Otp");
    }

    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const setPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      BAD_REQUEST(res, "Email is not existed");
      return;
    }

    if ((existingUser as any).otp != otp) {
      BAD_REQUEST(res, "Wrong Otp");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update(
      { otp: 0, otp_date: null, password: hashedPassword },
      { where: { id: existingUser.id } }
    );

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    SUCCESS_RESPONSE(res, LOG_IN_MESSAGE, {
      token,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {id} = req.user!
    const { email, old_password="", password } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      BAD_REQUEST(res, "User is not existed");
      return;
    }

    const isMatch = await bcrypt.compare(
      old_password,
      user?.password as string
    );

    if (!isMatch) {
      UNAUTHORIZED_RESPONSE(res, INCORRECT_PASSWORD);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update({ password: hashedPassword }, { where: { id: user.id } });

    SUCCESS_RESPONSE(res, PASSWORD_UPDATE);
    return;
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

function generateOTP(): number {
  return Math.floor(100000 + Math.random() * 900000);
}



// export const signInWholesale = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     var errorsArray = [];
//     const user = await User.findOne({
//       where: { email, status: STATUS.active,
//         role: {
//           [Op.in]: [ ROLES.wholesaler],
//         },
//        },
//     });

//     if (!user) {
//       errorsArray.push({
//         path: "email",
//         message: UNREGISTER_EMAIL,
//       });
//       BAD_REQUEST(res, UNREGISTER_EMAIL, [{}]);
//       return;
//     }

//     const isMatch = await bcrypt.compare(password, user?.password as string);

//     if (!isMatch) {
//       UNAUTHORIZED_RESPONSE(res, INCORRECT_PASSWORD);
//       return;
//     }

//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//       process.env.JWT_SECRET as string,
//       { expiresIn: "24h" }
//     );

//     SUCCESS_RESPONSE(res, LOG_IN_MESSAGE, {
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//     });
//     return;
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// };