import mongoose from "mongoose";

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
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    publicId: { type: String, trim: true },
    images: {
      type: [productImageSchema],
      default: [],
    },
    category: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    specs: {
      type: [String],
      default: [],
    },
    stock: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
