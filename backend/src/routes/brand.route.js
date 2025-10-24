import express from "express";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controller/brand.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";
import { authorize } from '../middleware/accessControl.middleware.js';

const router = express.Router();

// ✅ Create Brand
router.post(
  "/brand/create",
  verifyToken,
authorize('create', 'product', 'any'),
  createBrand
);

// ✅ Get All Brands
router.get(
  "/brand/list",
  verifyToken,
authorize('read', 'sale||product', 'any'),
  getAllBrands
);

// ✅ Get Brand by ID
router.get(
  "/brand/list/:id",
  verifyToken,
authorize('read', 'sale||product', 'any'),
  getBrandById
);

// ✅ Update Brand
router.put(
  "/brand/update/:id",
  verifyToken,
authorize('update', 'product', 'any'),
  updateBrand
);

// ✅ Delete Brand
router.delete(
  "/brand/delete/:id",
  verifyToken,
authorize('delete', 'product', 'any'),
  deleteBrand
);

export default router;
