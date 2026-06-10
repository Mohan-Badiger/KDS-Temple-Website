import express from "express";
import { getPublicSettings, getAdminSettings, updateAdminSettings } from "../controllers/settingsController.js";
import adminAuth from "../middleware/adminAuth.js";

const settingsRouter = express.Router();

// Public route to get contact details
settingsRouter.get("/", getPublicSettings);

// Admin authenticated routes
settingsRouter.get("/admin", adminAuth, getAdminSettings);
settingsRouter.put("/admin", adminAuth, updateAdminSettings);

export default settingsRouter;
