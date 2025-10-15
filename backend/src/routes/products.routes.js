import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  
  searchProductsByCategory
} from "../controller/products.controller.js";

const router = express.Router();

// Create Product
router.post("/product/create", createProduct);          // POST   /api/product/create

// Get all Products
router.get("/product/list", getAllProducts);            // GET    /api/product/list

// Get Product by ID
router.get("/product/detail/:id", getProductById);      // GET    /api/product/detail/:id

// Update Product
router.put("/product/update/:id", updateProduct);       // PUT    /api/product/update/:id

// Delete Product
router.delete("/product/delete/:id", deleteProduct);    // DELETE /api/product/delete/:i
router.get("/products/search-products", searchProductsByCategory);

export default router;
