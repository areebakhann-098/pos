import Variation from "../model/variation.model.js";
import VariationValue from "../model/variationValue.model.js";

// ✅ Create new variation with optional values
export const createVariation = async (req, res) => {
  try {
    const { name, values } = req.body;
    // Example frontend payload:
    // { "name": "Color", "values": ["Red", "Blue", "Green"] }

    // 1️⃣ Create the variation
    const variation = await Variation.create({ variation_name: name });

    // 2️⃣ If values provided, create them
    if (values && Array.isArray(values)) {
      const variationValues = values.map((val) => ({
        value_name: val,
        variation_id: variation.id,
      }));
      await VariationValue.bulkCreate(variationValues);
    }

    // 3️⃣ Fetch with values
    const newVariation = await Variation.findByPk(variation.id, {
      include: { model: VariationValue, as: "values" },
    });

    res.status(201).json({
      success: true,
      message: "Variation created successfully",
      data: newVariation,
    });
  } catch (error) {
    console.error("❌ Error creating variation:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ Get all variations with their values
export const getAllVariations = async (req, res) => {
  try {
    const variations = await Variation.findAll({
      include: {
        model: VariationValue,
        as: "values",
        attributes: ["id", "value_name"],
      },
    });

    res.status(200).json({ success: true, data: variations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ Get single variation by ID with values
export const getVariationById = async (req, res) => {
  try {
    const variation = await Variation.findByPk(req.params.id, {
      include: { model: VariationValue, as: "values" },
    });

    if (!variation) {
      return res.status(404).json({ success: false, message: "Variation not found" });
    }

    res.status(200).json({ success: true, data: variation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ Update variation (name + values)
export const updateVariation = async (req, res) => {
  try {
    const { name, values } = req.body; // values = ['Red', 'Green']
    const variation = await Variation.findByPk(req.params.id);

    if (!variation) {
      return res.status(404).json({ success: false, message: "Variation not found" });
    }

    // 1️⃣ Update variation name
    await variation.update({ variation_name: name });

    // 2️⃣ If values are provided, reset them (optional)
    if (values && Array.isArray(values)) {
      await VariationValue.destroy({ where: { variation_id: variation.id } });
      const newValues = values.map((val) => ({
        value_name: val,
        variation_id: variation.id,
      }));
      await VariationValue.bulkCreate(newValues);
    }

    const updatedVariation = await Variation.findByPk(variation.id, {
      include: { model: VariationValue, as: "values" },
    });

    res.status(200).json({
      success: true,
      message: "Variation updated successfully",
      data: updatedVariation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ Delete variation + its values
export const deleteVariation = async (req, res) => {
  try {
    const variation = await Variation.findByPk(req.params.id);

    if (!variation) {
      return res.status(404).json({ success: false, message: "Variation not found" });
    }

    await VariationValue.destroy({ where: { variation_id: variation.id } });
    await variation.destroy();

    res.status(200).json({ success: true, message: "Variation deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ Add new values to an existing variation (extra endpoint)
export const addVariationValues = async (req, res) => {
  try {
    const { values } = req.body; // ['Yellow', 'Pink']
    const { id } = req.params; // variation id

    const variation = await Variation.findByPk(id);
    if (!variation) {
      return res.status(404).json({ success: false, message: "Variation not found" });
    }

    const newValues = values.map((val) => ({
      value_name: val,
      variation_id: id,
    }));
    await VariationValue.bulkCreate(newValues);

    const updatedVariation = await Variation.findByPk(id, {
      include: { model: VariationValue, as: "values" },
    });

    res.status(200).json({
      success: true,
      message: "Values added successfully",
      data: updatedVariation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
