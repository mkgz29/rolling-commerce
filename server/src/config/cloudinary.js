import { v2 as cloudinary } from "cloudinary";

const requiredCloudinaryEnvVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const getMissingCloudinaryEnvVars = () => {
  return requiredCloudinaryEnvVars.filter((key) => !process.env[key]);
};

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
};

const validateCloudinaryConfig = () => {
  const missingEnvVars = getMissingCloudinaryEnvVars();

  if (missingEnvVars.length > 0) {
    const error = new Error(
      `Missing Cloudinary environment variables: ${missingEnvVars.join(", ")}`
    );
    error.statusCode = 500;
    throw error;
  }
};

configureCloudinary();

export { cloudinary, configureCloudinary, validateCloudinaryConfig };
