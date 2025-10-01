import Brand from "../model/brand.model.js";

// ✅ Create a new Brand
export const createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const brand = await Brand.create({
      name,
      description,
    });

    res.status(201).json({ message: "Brand created successfully", data: brand });
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get all Brands
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get single Brand by ID
export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Update Brand
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    brand.name = name ?? brand.name;
    brand.description = description ?? brand.description;
    await brand.save();

    res.json({ message: "Brand updated successfully", data: brand });
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete Brand (soft delete enabled)
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    await brand.destroy(); // soft delete (paranoid: true)
    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
