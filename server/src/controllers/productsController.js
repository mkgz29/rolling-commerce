import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/productService.js";
import { uploadImageFile } from "../services/image.service.js";

const buildProductData = async (body, file) => {
  const productData = { ...body };

  if (!file) {
    return productData;
  }

  const uploadedImage = await uploadImageFile(file, {
    folder: "rolling-commerce/products",
    transformation: [{ width: 1200, height: 1200, crop: "limit" }],
  });

  productData.image = uploadedImage.url;
  productData.images = [
    {
      url: uploadedImage.url,
      public_id: uploadedImage.public_id,
    },
  ];

  return productData;
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProductController = async (req, res, next) => {
  try {
    const productData = await buildProductData(req.body, req.file);
    const product = await createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProductsController = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const products = await getProducts({ category, search });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductByIdController = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProductController = async (req, res, next) => {
  try {
    const productData = await buildProductData(req.body, req.file);
    const product = await updateProduct(req.params.id, productData);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProductController = async (req, res, next) => {
  try {
    const result = await deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  createProductController as createProduct,
  getProductsController as getProducts,
  getProductByIdController as getProductById,
  updateProductController as updateProduct,
  deleteProductController as deleteProduct,
};
