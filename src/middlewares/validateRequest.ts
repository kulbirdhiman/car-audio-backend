import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { BAD_REQUEST } from "../helper/apiResponse";
import { VALIDATION_ERROR_MESSAGE } from "../helper/errorsConst";

const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    BAD_REQUEST(res, VALIDATION_ERROR_MESSAGE, errors.array());
    return;
  }
  next();
};

export default validateRequest;
