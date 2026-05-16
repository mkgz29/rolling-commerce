import Category from "../models/category.js";
import Product from "../models/products.js";
import { VALIDATION_LIMITS } from "../constants/validationLimits.js";
import { sanitizeLimitedString } from "../utils/validators.js";

const getCategories = async (req, res) => {
  try {
    let categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    if (categories.length === 0) {
      const productCategories = await Product.distinct("category");
      categories = productCategories.map(cat => ({
        _id: cat,
        name: cat,
        isActive: true
      }));
    }

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category && category.isActive) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({
      name: sanitizeLimitedString(name, "name", VALIDATION_LIMITS.productName, { required: true }),
      description: sanitizeLimitedString(description || "", "description", VALIDATION_LIMITS.productDescription),
    });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updateData = {};

    if (req.body.name !== undefined) {
      updateData.name = sanitizeLimitedString(req.body.name, "name", VALIDATION_LIMITS.productName, {
        required: true,
      });
    }

    if (req.body.description !== undefined) {
      updateData.description = sanitizeLimitedString(
        req.body.description,
        "description",
        VALIDATION_LIMITS.productDescription,
      );
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.isActive = false;
      await category.save();
      res.json({ message: "Category deactivated" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
