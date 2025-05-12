import express from "express";
import upload from "../middlewares/upload"
 
import { authenticateUser } from "../middlewares/auth"; // Optional authentication middleware
import { deleteFiles, uploadFile } from "../controllers/upload";

const router = express.Router();

// POST /v1/upload
router.post("/", upload.single("file"), uploadFile);

router.post("/delete",authenticateUser, deleteFiles);

export default router;
