import express from "express";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controller/brand.controller.js";

const router = express.Router();

router.post("/brand/create", createBrand);          // POST /api/brands/create
router.get("/brand/list", getAllBrands);            // GET  /api/brands/list
router.get("/brand/list/:id", getBrandById);      // GET  /api/brands/detail/:id
router.put("/brand/update/:id", updateBrand);       // PUT  /api/brands/update/:id
router.delete("/brand/delete/:id", deleteBrand); 
export default router;
