import { cloudinary, validateCloudinaryConfig } from "../config/cloudinary.js";

const validateFileData = (fileData) => {
  if (!fileData) {
    throw new Error("File data is required");
  }

  // Puede ser un buffer, un string base64, o una ruta local
  if (
    typeof fileData !== "string" &&
    !Buffer.isBuffer(fileData) &&
    typeof fileData !== "object"
  ) {
    throw new Error(
      "File data must be a string (base64 or URL), a Buffer, or a readable stream"
    );
  }

  return true;
};

const extractPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    // Formato típico: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{ext}
    const regex = /\/([^/]+)\.[a-zA-Z0-9]+$/;
    const match = url.match(regex);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  } catch (error) {
    console.error("[extractPublicIdFromUrl] Error extracting public ID:", error);
    return null;
  }
};

const uploadImage = async (fileData, options = {}) => {
  try {
    validateCloudinaryConfig();
    validateFileData(fileData);

    const uploadOptions = {
      folder: options.folder || "rolling-commerce/products",
      resource_type: options.resource_type || "auto",
      quality: options.quality || "auto",
      fetch_format: options.fetch_format || "auto",
      width: options.width || undefined,
      height: options.height || undefined,
      crop: options.crop || "limit",
      ...options,
    };

    // Remover propiedades undefined
    Object.keys(uploadOptions).forEach(
      (key) => uploadOptions[key] === undefined && delete uploadOptions[key]
    );

    const result = await cloudinary.uploader.upload(fileData, uploadOptions);

    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      version: result.version,
    };
  } catch (error) {
    console.error("[uploadImage] Error uploading image:", error.message);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

const deleteImage = async (publicIdOrUrl) => {
  try {
    validateCloudinaryConfig();

    if (!publicIdOrUrl) {
      throw new Error("Public ID or URL is required");
    }

    let publicId = publicIdOrUrl;

    // Si recibe una URL, extraer el public ID
    if (publicIdOrUrl.startsWith("http")) {
      publicId = extractPublicIdFromUrl(publicIdOrUrl);

      if (!publicId) {
        throw new Error("Could not extract public ID from URL");
      }
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error("Image deletion failed");
    }

    return {
      success: true,
      message: `Image ${publicId} deleted successfully`,
    };
  } catch (error) {
    console.error("[deleteImage] Error deleting image:", error.message);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

const getOptimizedImageUrl = (publicId, options = {}) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required");
    }

    const width = options.width || 300;
    const height = options.height || 300;
    const crop = options.crop || "fill";
    const quality = options.quality || "auto";
    const fetchFormat = options.format || "auto";

    const url = cloudinary.url(publicId, {
      width,
      height,
      crop,
      quality,
      fetch_format: fetchFormat,
      secure: true,
    });

    return url;
  } catch (error) {
    console.error("[getOptimizedImageUrl] Error generating URL:", error.message);
    throw new Error(`Failed to generate optimized URL: ${error.message}`);
  }
};

const uploadProfileImage = async (fileData) => {
  return uploadImage(fileData, {
    folder: "rolling-commerce/profiles",
    width: 500,
    height: 500,
    crop: "fill",
  });
};

const uploadProductImage = async (fileData) => {
  return uploadImage(fileData, {
    folder: "rolling-commerce/products",
    width: 800,
    height: 800,
    crop: "limit",
  });
};

const deleteProfileImage = async (publicIdOrUrl) => {
  return deleteImage(publicIdOrUrl);
};

const deleteProductImage = async (publicIdOrUrl) => {
  return deleteImage(publicIdOrUrl);
};

export {
  uploadImage,
  deleteImage,
  getOptimizedImageUrl,
  uploadProfileImage,
  uploadProductImage,
  deleteProfileImage,
  deleteProductImage,
  validateCloudinaryConfig,
  extractPublicIdFromUrl,
};
