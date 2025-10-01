// routes/businessLocationRoutes.js
import express from "express";
import {
  createBusinessLocation,
  getAllBusinessLocations,
  getBusinessLocationById,
  updateBusinessLocation,
  deleteBusinessLocation,
} from "../controller/business-location.controller.js";

const router = express.Router();

router.post("/business-locations/create", createBusinessLocation);
router.get("/business-locations/get", getAllBusinessLocations);
router.get("/business-locations/:id", getBusinessLocationById);
router.put("/business-locations/:id", updateBusinessLocation);
router.delete("/business-locations/:id", deleteBusinessLocation);

export default router;
