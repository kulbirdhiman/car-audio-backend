// src/interfaces/authInterfaces.ts
import { Request  } from "express";
export interface DecodedToken {
  id: string;
  role: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}
