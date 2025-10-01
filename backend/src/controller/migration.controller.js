import {  BusinessLocation } from "../model/migration.associations.js";
import {Migration} from "../model/migration.associations.js";
// Create Migration 
export const createMigration = async (req, res) => {
  try {
const migration = await Migration.create(req.body);
    res.status(201).json({
      message: "Migration created successfully",
      data: migration,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating migration", error: error.message });
  }
};

// Get All Migrations
export const getMigrations = async (req, res) => {
  try {
    const migrations = await Migration.findAll({
      include: [
        { model: BusinessLocation, as: "fromLocation", attributes: ["id", "name"] },
        { model: BusinessLocation, as: "toLocation", attributes: ["id", "name"] },
        // { model: Products, as: "product", attributes: ["id", "name"] }, // optional
      ],
    });

    res.status(200).json(migrations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching migrations", error: error.message });
  }
};

// Get Migration by ID
export const getMigrationById = async (req, res) => {
  try {
    const migration = await Migration.findByPk(req.params.id, {
      include: [
        { model: BusinessLocation, as: "fromLocation", attributes: ["id", "name"] },
        { model: BusinessLocation, as: "toLocation", attributes: ["id", "name"] },
        { model: Products, as: "product", attributes: ["id", "name"] },
      ],
    });

    if (!migration) return res.status(404).json({ message: "Migration not found" });

    res.status(200).json(migration);
  } catch (error) {
    res.status(500).json({ message: "Error fetching migration", error: error.message });
  }
};

// Update Migration
export const updateMigration = async (req, res) => {
  try {
    const migration = await Migration.findByPk(req.params.id);
    if (!migration) return res.status(404).json({ message: "Migration not found" });

    await migration.update(req.body);
    res.status(200).json({ message: "Migration updated successfully", data: migration });
  } catch (error) {
    res.status(500).json({ message: "Error updating migration", error: error.message });
  }
};

// Delete Migration
export const deleteMigration = async (req, res) => {
  try {
    const migration = await Migration.findByPk(req.params.id);
    if (!migration) return res.status(404).json({ message: "Migration not found" });

    await migration.destroy();
    res.status(200).json({ message: "Migration deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting migration", error: error.message });
  }
};
