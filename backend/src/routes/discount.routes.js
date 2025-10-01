import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
} from "../controller/discount.controller.js";

const router = express.Router();

router.post("/discounts/create", createDiscount);
router.get("/discounts/get", getAllDiscounts);
router.get("/discounts/:id", getDiscountById);
router.put("/discounts/:id", updateDiscount);
router.delete("/discounts/delete/:id", deleteDiscount);

export default router;
