// routes/businessLocationRoutes.js
import express from "express";
import {
  createBusinessLocation,
  getAllBusinessLocations,
  getBusinessLocationById,
  updateBusinessLocation,
  deleteBusinessLocation,
} from "../controller/business-location.controller.js";
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';
const router = express.Router();

router.post("/business-locations/create", verifyToken, authorize('create', 'product', 'any'), createBusinessLocation);
router.get("/business-locations/get",verifyToken, authorize('read', 'sale||product', 'any'), getAllBusinessLocations);
router.get("/business-locations/:id",verifyToken, authorize('read', 'sale||product', 'any'), getBusinessLocationById);
router.put("/business-locations/:id",verifyToken, authorize('update', 'product', 'any'), updateBusinessLocation);
router.delete("/business-locations/:id",verifyToken, authorize('delete', 'product', 'any'), deleteBusinessLocation);

export default router;
