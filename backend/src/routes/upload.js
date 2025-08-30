import express from "express";
import multer from "multer";
import { handleUpload } from "../controllers/summaryController.js";

const router = express.Router();

// ✅ Use memory storage (no "uploads/" folder required)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), handleUpload);

export default router;
