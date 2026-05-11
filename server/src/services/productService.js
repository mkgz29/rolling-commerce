import Product from "../models/products.js";
import mongoose from "mongoose";

const BUILD_PC_CATEGORIES = new Set([
  "processors",
  "graphics-cards",
  "ram",
  "storage",
  "power-supplies",
  "cases",
]);

const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const CATEGORY_ALIASES = new Map([
  ["procesador", "processors"],
  ["procesadores", "processors"],
  ["cpu", "processors"],
  ["processor", "processors"],
  ["processors", "processors"],
  ["placa de video", "graphics-cards"],
  ["placas de video", "graphics-cards"],
  ["gpu", "graphics-cards"],
  ["tarjeta grafica", "graphics-cards"],
  ["tarjetas graficas", "graphics-cards"],
  ["graphics card", "graphics-cards"],
  ["graphics-cards", "graphics-cards"],
  ["ram", "ram"],
  ["memoria ram", "ram"],
  ["memory", "ram"],
  ["disco", "storage"],
  ["ssd", "storage"],
  ["hdd", "storage"],
  ["almacenamiento", "storage"],
  ["storage", "storage"],
  ["nvme", "storage"],
  ["fuente", "power-supplies"],
  ["fuentes", "power-supplies"],
  ["psu", "power-supplies"],
  ["power supply", "power-supplies"],
  ["power-supplies", "power-supplies"],
  ["gabinete", "cases"],
  ["gabinetes", "cases"],
  ["case", "cases"],
  ["cases", "cases"],
  ["chasis", "cases"],
  ["chassis", "cases"],
]);

const normalizeCategory = (category) => {
  const normalized = normalizeText(category);

  if (BUILD_PC_CATEGORIES.has(normalized)) {
    return normalized;
  }

  return CATEGORY_ALIASES.get(normalized) || category.trim();
};

const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === "") return defaultValue;
  if (typeof value === "boolean") return value;
  return ["true", "1", "yes", "on"].includes(String(value).toLowerCase());
};

const parseSpecs = (specs) => {
  if (!specs) return [];
  if (Array.isArray(specs)) return specs.map((item) => String(item).trim()).filter(Boolean);

  if (typeof specs === "string") {
    try {
      const parsedSpecs = JSON.parse(specs);
      if (Array.isArray(parsedSpecs)) {
        return parsedSpecs.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return specs
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const validateProductData = (data) => {
  const {
    name,
    price,
    description,
    image,
    imageUrl,
    publicId,
    images = [],
    category,
    brand,
    specs,
    stock,
    isActive,
  } = data;
  const parsedStock = Number(stock);

  if (!name || !name.trim()) {
    throw new Error("Product name is required");
  }

  if (price === undefined || price === null || isNaN(price) || price < 0) {
    throw new Error("Product price must be a valid positive number");
  }

  if (!description || !description.trim()) {
    throw new Error("Product description is required");
  }

  if (!image?.trim() && !imageUrl?.trim() && (!Array.isArray(images) || images.length === 0)) {
    throw new Error("At least one product image is required");
  }

  if (!Array.isArray(images)) {
    throw new Error("Product images must be an array");
  }

  const normalizedImages = images.map((item) => {
    const itemPublicId = item?.public_id || item?.publicId;

    if (!item?.url?.trim() || !itemPublicId?.trim()) {
      throw new Error("Each product image must include url and public_id");
    }

    return {
      url: item.url.trim(),
      public_id: itemPublicId.trim(),
      publicId: itemPublicId.trim(),
    };
  });

  const primaryImage = imageUrl?.trim() || image?.trim() || normalizedImages[0]?.url;
  const primaryPublicId = publicId?.trim() || normalizedImages[0]?.public_id || "";
  const finalImages =
    normalizedImages.length > 0
      ? normalizedImages
      : primaryPublicId
        ? [{ url: primaryImage, public_id: primaryPublicId, publicId: primaryPublicId }]
        : [];

  if (!primaryImage) {
    throw new Error("Product image URL is required");
  }

  if (!category || !category.trim()) {
    throw new Error("Product category is required");
  }

  if (
    stock === undefined ||
    stock === null ||
    stock === "" ||
    !Number.isInteger(parsedStock) ||
    parsedStock < 0
  ) {
    throw new Error("Product stock must be a non-negative integer");
  }

  return {
    name: name.trim(),
    price: parseFloat(price),
    description: description.trim(),
    image: primaryImage,
    imageUrl: primaryImage,
    publicId: primaryPublicId,
    images: finalImages,
    category: normalizeCategory(category),
    brand: brand?.trim() || "",
    specs: parseSpecs(specs),
    stock: parsedStock,
    isActive: parseBoolean(isActive, true),
  };
};

const createProduct = async (productData) => {
  const validatedData = validateProductData(productData);

  const product = new Product(validatedData);
  const createdProduct = await product.save();

  return createdProduct.toJSON();
};

const getProducts = async ({ category = null, search = null, includeInactive = false } = {}) => {
  const filter = includeInactive ? {} : { isActive: { $ne: false } };

  if (category && category.trim()) {
    filter.category = normalizeCategory(category);
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

  if (!product || product.isActive === false) {
    throw new Error("Product not found");
  }

  return product;
};

const getFeaturedProducts = async (limit = 6) => {
  const products = await Product.find({ isActive: { $ne: false } })
    .sort({ rating: -1, numReviews: -1 })
    .limit(limit);

  return products;
};

const updateProduct = async (productId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  const existingProduct = await Product.findById(productId);

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  const hasReplacementImage =
    Boolean(updateData.image?.trim()) ||
    Boolean(updateData.imageUrl?.trim()) ||
    (Array.isArray(updateData.images) && updateData.images.length > 0);

  const imageData = hasReplacementImage
    ? {
        image: updateData.image,
        imageUrl: updateData.imageUrl,
        publicId: updateData.publicId,
        images: updateData.images,
      }
    : {
        image: existingProduct.image,
        imageUrl: existingProduct.imageUrl,
        publicId: existingProduct.publicId,
        images: existingProduct.images,
      };

  const validatedData = validateProductData({
    name: updateData.name,
    price: updateData.price,
    description: updateData.description,
    ...imageData,
    category: updateData.category,
    brand: updateData.brand,
    specs: updateData.specs,
    stock: updateData.stock,
    isActive: updateData.isActive,
  });

  Object.assign(existingProduct, validatedData);
  await existingProduct.save();

  return existingProduct;
};

const deleteProduct = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  product.isActive = false;
  await product.save();

  return { message: "Product deactivated successfully" };
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
