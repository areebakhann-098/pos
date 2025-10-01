import Variation from "../model/variation.model.js";
 
// ✅ Create new variation
export const createVariation = async (req, res) => {
  try {
    const variation = await Variation.create(req.body);
    res.status(201).json({
      success: true,
      message: "Variation created successfully",
      data: variation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// ✅ Get all variations
export const getAllVariations = async (req, res) => {
  try {
    const variations = await Variation.findAll();
    res.status(200).json({ success: true, data: variations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// ✅ Get single variation by ID
export const getVariationById = async (req, res) => {
  try {
    const variation = await Variation.findByPk(req.params.id);
 
    if (!variation) {
      return res.status(404).json({ success: false, message: "Variation not found" });
    }
 
    res.status(200).json({ success: true, data: variation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// ✅ Update variation
export const updateVariation = async (req, res) => {
  try {
    const variation = await Variation.findByPk(req.params.id);
 
    if (!variation) {
      return res.status(404).json({ success: false, message: "Variation not found" });
    }
 
    await variation.update(req.body);
 
    res.status(200).json({
      success: true,
      message: "Variation updated successfully",
      data: variation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// ✅ Delete variation
export const deleteVariation = async (req, res) => {
  try {
    const variation = await Variation.findByPk(req.params.id);
 
    if (!variation) {
      return res.status(404).json({ success: false, message: "Variation not found" });
    }
 
    await variation.destroy();
 
    res.status(200).json({ success: true, message: "Variation deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};