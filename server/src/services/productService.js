import Product from "../models/products.js";
import mongoose from "mongoose";

const validateProductData = (data) => {
  const { name, price, description, image, category, stock } = data;

  if (!name || !name.trim()) {
    throw new Error("Product name is required");
  }

  if (price === undefined || price === null || isNaN(price) || price < 0) {
    throw new Error("Product price must be a valid positive number");
  }

  if (!description || !description.trim()) {
    throw new Error("Product description is required");
  }

  if (!image || !image.trim()) {
    throw new Error("Product image URL is required");
  }

  if (!category || !category.trim()) {
    throw new Error("Product category is required");
  }

  if (stock === undefined || stock === null || !Number.isInteger(stock) || stock < 0) {
    throw new Error("Product stock must be a non-negative integer");
  }

  return {
    name: name.trim(),
    price: parseFloat(price),
    description: description.trim(),
    image: image.trim(),
    category: category.trim(),
    stock: parseInt(stock),
  };
};

const createProduct = async (productData) => {
  const validatedData = validateProductData(productData);

  const product = new Product(validatedData);
  const createdProduct = await product.save();

  return createdProduct.toJSON();
};

const getProducts = async ({ category = null, search = null } = {}) => {
  const filter = {};

  if (category && category.trim()) {
    filter.category = category.trim();
  }

  if (search && search.trim()) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
    ];
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });

  return products;
};

const getProductById = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const getFeaturedProducts = async (limit = 6) => {
  const products = await Product.find()
    .sort({ rating: -1, numReviews: -1 })
    .limit(limit);

  return products;
};

const updateProduct = async (productId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  const validatedData = validateProductData({
    name: updateData.name,
    price: updateData.price,
    description: updateData.description,
    image: updateData.image,
    category: updateData.category,
    stock: updateData.stock,
  });

  const product = await Product.findByIdAndUpdate(
    productId,
    validatedData,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const deleteProduct = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  await product.deleteOne();

  return { message: "Product deleted successfully" };
};

const decreaseStock = async (productId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock for this product");
  }

  product.stock -= quantity;
  await product.save();

  return product;
};

export {
  createProduct,
  getProducts,
  getProductById,
  getFeaturedProducts,
  updateProduct,
  deleteProduct,
  decreaseStock,
  validateProductData,
};
