import mongoose from "mongoose";
import { NUMBER_LIMITS, VALIDATION_LIMITS } from "../constants/validationLimits.js";

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    public_id: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: VALIDATION_LIMITS.productName },
    price: { type: Number, required: true, min: NUMBER_LIMITS.price.min, max: NUMBER_LIMITS.price.max },
    description: { type: String, required: true, trim: true, maxlength: VALIDATION_LIMITS.productDescription },
    image: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    publicId: { type: String, trim: true },
    images: {
      type: [productImageSchema],
      default: [],
    },
    category: { type: String, required: true, trim: true, maxlength: VALIDATION_LIMITS.productName },
    brand: { type: String, trim: true, maxlength: VALIDATION_LIMITS.name },
    specs: {
      type: [String],
      default: [],
    },
    stock: { type: Number, required: true, min: NUMBER_LIMITS.stock.min, max: NUMBER_LIMITS.stock.max },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
