import express from "express";
import { getUsers, createUser } from "../controllers/users";
import { body } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { AccessororiesList, audioEquipments, hotDeals, recomendedProjectsList, weekelyHighLights } from "../controllers/home";

const router = express.Router();

router.get("/recomened_product", recomendedProjectsList);
router.get("/acessory_product", AccessororiesList);
router.get("/audio_product", audioEquipments);
router.get("/weekly_highlights", weekelyHighLights);
router.get("/hot_deals", hotDeals);
 

export default router;
``