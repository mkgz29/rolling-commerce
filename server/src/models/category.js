import mongoose from "mongoose";
import { VALIDATION_LIMITS } from "../constants/validationLimits.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: VALIDATION_LIMITS.productName,
    },
    description: {
      type: String,
      trim: true,
      maxlength: VALIDATION_LIMITS.productDescription,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
