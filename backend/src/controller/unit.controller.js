import Unit from "../model/unit.model.js";

// ✅ Create Unit
export const createUnit = async (req, res) => {
  try {
    const { name, short_name} = req.body;

    if (!name || !short_name) {
      return res.status(400).json({
        error: "name, short_name and created_by are required",
      });
    }

    const unit = await Unit.create({
      name,
      short_name,
    });

    res
      .status(201)
      .json({ message: "Unit created successfully", data: unit });
  } catch (error) {
    console.error("Error creating unit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get All Units
export const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.findAll();
    res.json(units);
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get Unit by ID
export const getUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await Unit.findByPk(id);

    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }

    res.json(unit);
  } catch (error) {
    console.error("Error fetching unit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Update Unit
export const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, short_name} = req.body;

    const unit = await Unit.findByPk(id);
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }

    unit.name = name ?? unit.name;
    unit.short_name = short_name ?? unit.short_name;

    await unit.save();

    res.json({ message: "Unit updated successfully", data: unit });
  } catch (error) {
    console.error("Error updating unit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete Unit (soft delete)
export const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await Unit.findByPk(id);
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }

    await unit.destroy();

    res.json({ message: "Unit deleted successfully" });
  } catch (error) {
    console.error("Error deleting unit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
