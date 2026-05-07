import multer from "multer";

const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024;
const DEFAULT_MAX_FILES = 6;

const createUploadError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const imageFileFilter = (req, file, callback) => {
  if (!allowedImageMimeTypes.has(file.mimetype)) {
    callback(
      createUploadError(
        "Invalid file type. Only JPG, JPEG, PNG and WEBP images are allowed."
      )
    );
    return;
  }

  callback(null, true);
};

const storage = multer.memoryStorage();

const createImageUpload = ({
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  maxFiles = DEFAULT_MAX_FILES,
} = {}) => {
  return multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
      fileSize: maxFileSize,
      files: maxFiles,
    },
  });
};

const productImageUpload = createImageUpload({ maxFiles: 8 });
const userImageUpload = createImageUpload({ maxFiles: 1, maxFileSize: 3 * 1024 * 1024 });
const bannerImageUpload = createImageUpload({ maxFiles: 3, maxFileSize: 8 * 1024 * 1024 });

const handleMulterError = (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof multer.MulterError) {
    const error = createUploadError(err.message);
    next(error);
    return;
  }

  next(err);
};

export {
  createImageUpload,
  productImageUpload,
  userImageUpload,
  bannerImageUpload,
  handleMulterError,
  allowedImageMimeTypes,
};
