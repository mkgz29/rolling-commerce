import mongoose from "mongoose";
import Category from "../models/category.js";
import Product from "../models/products.js";
import { VALIDATION_LIMITS } from "../constants/validationLimits.js";
import { sanitizeLimitedString } from "../utils/validators.js";

const CATEGORY_HAS_PRODUCTS_MESSAGE = "No se puede eliminar esta categoría porque tiene productos asociados.";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(String(id || ""));

const ensureProductCategoriesExist = async () => {
  const productCategories = await Product.distinct("category");
  const categoryNames = productCategories
    .map((category) => String(category || "").trim())
    .filter(Boolean);

  for (const categoryName of categoryNames) {
    await Category.findOneAndUpdate(
      { name: categoryName },
      {
        $setOnInsert: {
          name: categoryName,
          description: "",
          isActive: true,
        },
      },
      { new: true, upsert: true, runValidators: true },
    );
  }
};

const getCategories = async (req, res) => {
  try {
    let categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    if (categories.length === 0) {
      await ensureProductCategoriesExist();
      categories = await Category.find({ isActive: true }).sort({ name: 1 });
    }

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

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
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

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
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(req.params.id);

    if (category) {
      const associatedProducts = await Product.countDocuments({ category: category.name });

      if (associatedProducts > 0) {
        return res.status(409).json({ message: CATEGORY_HAS_PRODUCTS_MESSAGE });
      }

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
