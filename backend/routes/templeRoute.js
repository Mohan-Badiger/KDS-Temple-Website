import express from "express";
import { addTemple, getAllTemples, updateTemple, deleteTemple } from "../controllers/templeController.js";
import upload from "../middleware/multer.js";

const templeRouter = express.Router();

templeRouter.post("/add", upload.single('image'), addTemple);
templeRouter.get("/list", getAllTemples);
templeRouter.get("/all", getAllTemples);
templeRouter.post("/update/:id", upload.single('image'), updateTemple);
templeRouter.delete("/delete/:id", deleteTemple);
templeRouter.delete("/remove/:id", deleteTemple);

export default templeRouter;
