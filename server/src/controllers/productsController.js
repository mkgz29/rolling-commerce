import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/productService.js";

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProductController = async (req, res, next) => {
  try {
    const productData = req.body;
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
    const product = await updateProduct(req.params.id, req.body);
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
