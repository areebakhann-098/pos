import express from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controller/contact.controller.js";

const router = express.Router();

// CREATE → POST /api/v1/contacts
router.post("/contacts", createContact);

// READ ALL → GET /api/v1/contacts
router.get("/contacts", getAllContacts);

// READ ONE → GET /api/v1/contacts/:id
router.get("/contacts/:id", getContactById);

// UPDATE → PUT /api/v1/contacts/:id
router.put("/contacts/:id", updateContact);

// DELETE → DELETE /api/v1/contacts/:id
router.delete("/contacts/:id", deleteContact);

export default router;
