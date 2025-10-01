import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/categories.controller.js";

const router = express.Router();

// ✅ Explicit route names
router.post("/categories/create", createCategory);          // POST   /api/categories/create
router.get("/categories/list", getAllCategories);           // GET    /api/categories/list
router.get("/categories/list/:id", getCategoryById);      // GET    /api/categories/detail/:id
router.put("/categories/update/:id", updateCategory);       // PUT    /api/categories/update/:id
router.delete("/categories/delete/:id", deleteCategory);    // DELETE /api/categories/delete/:id

export default router;
