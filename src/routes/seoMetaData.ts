import express from "express";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { authenticateUser } from "../middlewares/auth";
import {
  createProduct,
  deleteProduct,
  editProduct,
  listProduct,
  listProductForShop,
  productDetail,
  productDetailForShop,
} from "../controllers/product";
import { categorySeoMeta, modelSeoMeta, productSeoMeta, redirectUrls } from "../controllers/seoMetaData";

const router = express.Router();

 

//detail
router.get("/list/:slug", validateRequest, productSeoMeta);

//detail
router.get("/category_list/:slug", validateRequest, categorySeoMeta);

//detail
router.get("/model_list/:slug", validateRequest, modelSeoMeta);

router.get("/redirect_urls", validateRequest, redirectUrls);


export default router;