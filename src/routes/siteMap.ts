import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
 
import {
 
  productDetailForShop,
} from "../controllers/product";
import { allCarModelsDetail, listCompanyModelForSiteMap, listProductForSiteMap } from "../controllers/siteMap";

const router = express.Router();

 
 
 
router.get("/list", validateRequest, listProductForSiteMap);

 
router.get("/category/list", validateRequest, listCompanyModelForSiteMap);

router.get("/model/list", validateRequest, allCarModelsDetail);

export default router;
