// routes/saleReturn.routes.js
import express from "express";
import {
  createSaleReturn,
  getAllSaleReturns,
} from "../controller/saleReturn.controller.js";

const router = express.Router();

router.post("/sale-return/create", createSaleReturn);
router.get("/sale-return/get", getAllSaleReturns);

export default router;
