import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/categories.controller.js";
import { verifyToken } from '../middleware/jwt.middleware.js';
import { authorize } from '../middleware/accessControl.middleware.js';
const router = express.Router();

// ✅ Explicit route names
router.post("/categories/create",verifyToken, authorize('create', 'product', 'any'),  createCategory);          // POST   /api/categories/create
router.get("/categories/list", verifyToken, authorize('read', 'sale||product', 'any'), getAllCategories);           // GET    /api/categories/list
router.put("/categories/update/:id",  verifyToken, authorize('update', 'sale||product', 'any'), updateCategory);       // PUT    /api/categories/update/:id
router.delete("/categories/delete/:id", verifyToken, authorize('delete', 'product', 'any'), deleteCategory);    // DELETE /api/categories/delete/:id

export default router;
