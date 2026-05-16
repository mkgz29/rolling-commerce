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
  productData.imageUrl = uploadedImage.url;
  productData.publicId = uploadedImage.public_id;
  productData.images = [
    {
      url: uploadedImage.url,
      public_id: uploadedImage.public_id,
      publicId: uploadedImage.public_id,
    },
  ];

  return productData;
};

const createProductController = async (req, res, next) => {
  try {
    const productData = await buildProductData(req.body, req.file);
    const product = await createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const getProductsController = async (req, res, next) => {
  try {
    const { category, search, includeInactive } = req.query;
    const products = await getProducts({ 
      category, 
      search, 
      includeInactive: includeInactive === "true" 
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductByIdController = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const updateProductController = async (req, res, next) => {
  try {
    const productData = await buildProductData(req.body, req.file);
    const product = await updateProduct(req.params.id, productData);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

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
