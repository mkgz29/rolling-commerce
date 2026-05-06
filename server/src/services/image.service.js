import { Readable } from "node:stream";
import { cloudinary, validateCloudinaryConfig } from "../config/cloudinary.js";

const defaultUploadOptions = {
  resource_type: "image",
  quality: "auto",
  fetch_format: "auto",
};

const uploadBufferToCloudinary = (buffer, options = {}) => {
  validateCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        ...defaultUploadOptions,
        folder: options.folder || "rolling-commerce/products",
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

const uploadImageFile = async (file, options = {}) => {
  if (!file?.buffer) {
    const error = new Error("Image file buffer is required");
    error.statusCode = 400;
    throw error;
  }

  return uploadBufferToCloudinary(file.buffer, options);
};

const uploadImageFiles = async (files = [], options = {}) => {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  return Promise.all(files.map((file) => uploadImageFile(file, options)));
};

const deleteImageByPublicId = async (publicId) => {
  validateCloudinaryConfig();

  if (!publicId) {
    const error = new Error("Cloudinary public_id is required");
    error.statusCode = 400;
    throw error;
  }

  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

const getOptimizedImageUrl = (publicId, options = {}) => {
  if (!publicId) {
    return null;
  }

  return cloudinary.url(publicId, {
    secure: true,
    fetch_format: "auto",
    quality: "auto",
    ...options,
  });
};

const uploadProductImages = (files) => {
  return uploadImageFiles(files, {
    folder: "rolling-commerce/products",
    transformation: [{ width: 1200, height: 1200, crop: "limit" }],
  });
};

const uploadUserAvatar = (file) => {
  return uploadImageFile(file, {
    folder: "rolling-commerce/users",
    transformation: [{ width: 600, height: 600, crop: "fill", gravity: "face" }],
  });
};

const uploadBannerImages = (files) => {
  return uploadImageFiles(files, {
    folder: "rolling-commerce/banners",
    transformation: [{ width: 1800, height: 700, crop: "limit" }],
  });
};

export {
  uploadImageFile,
  uploadImageFiles,
  uploadProductImages,
  uploadUserAvatar,
  uploadBannerImages,
  deleteImageByPublicId,
  getOptimizedImageUrl,
};
