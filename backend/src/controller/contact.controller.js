// controllers/contact.controller.js
import Contact from "../model/contact.model.js";

// CREATE
export const createContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating contact",
      error: error.message,
    });
  }
};

// READ ALL
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();

    return res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching contacts",
      error: error.message,
    });
  }
};


// READ ONE (by ID)
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching contact",
      error: error.message,
    });
  }
};

// ✅ UPDATE
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }
await contact.update(req.body);
    

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating contact",
      error: error.message,
    });
  }
};

// ✅ DELETE (soft delete because paranoid: true)
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await contact.destroy(); // this will soft delete (sets deleted_at)

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting contact",
      error: error.message,
    });
  }
};
