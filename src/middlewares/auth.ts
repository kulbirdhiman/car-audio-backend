import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  UNAUTHORIZED_RESPONSE,
  FORBIDDEN_RESPONSE,
} from "../helper/apiResponse";
import { log } from "console";
import { AuthenticatedRequest } from "../interfaces/auth";

// Extend the Express Request type to include user property

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization");

  if (!token) {
    UNAUTHORIZED_RESPONSE(res, "Access Denied: No token provided");
    return;
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET as string
    ) as AuthenticatedRequest["user"];

    req.user = decoded; // Now TypeScript won't complain
    next();
  } catch (err) {
    // console.log(err)
    FORBIDDEN_RESPONSE(res, "Invalid Token");
  }
};

export const authorizeRoles = (...allowedRoles: number[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user || !allowedRoles.includes(Number(req.user.role))) {
      FORBIDDEN_RESPONSE(res, "Forbidden: Insufficient privileges");
      return;
    }
    next();
  };
};


const ALLOWED_DOMAINS = [ "http://localhost:3000"]; // Add more if needed

export const checkDomain = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.header("Origin");

  if (!origin || !ALLOWED_DOMAINS.includes(origin)) {
    FORBIDDEN_RESPONSE(res, "Forbidden: Request from unauthorized domain");
    return;
  }

  next();
};