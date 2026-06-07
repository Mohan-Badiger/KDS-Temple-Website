import express from "express";
import { addTemple, getAllTemples, updateTemple, deleteTemple, updateTempleAvailability } from "../controllers/templeController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const templeRouter = express.Router();

templeRouter.post("/add", adminAuth, upload.single('image'), addTemple);
templeRouter.get("/list", getAllTemples);
templeRouter.post("/update/:id", adminAuth, upload.single('image'), updateTemple);
templeRouter.delete("/remove/:id", adminAuth, deleteTemple);
templeRouter.put("/update-availability", adminAuth, updateTempleAvailability);

export default templeRouter;
