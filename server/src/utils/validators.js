import { NUMBER_LIMITS, VALIDATION_LIMITS } from "../constants/validationLimits.js";

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
};

export const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

export const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/[<>$`{}]/g, "")
    .trim();
};

export const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

export const sanitizeLimitedString = (value, fieldName, maxLength, { required = false } = {}) => {
  if (value === undefined || value === null) {
    if (required) throw createValidationError(`${fieldName} is required`);
    return "";
  }

  if (typeof value !== "string") {
    throw createValidationError(`${fieldName} must be a string`);
  }

  const sanitized = sanitizeString(value);

  if (required && !sanitized) {
    throw createValidationError(`${fieldName} is required`);
  }

  if (sanitized.length > maxLength) {
    throw createValidationError(`${fieldName} must be at most ${maxLength} characters`);
  }

  return sanitized;
};

export const sanitizeEmail = (value, { required = false } = {}) => {
  const email = sanitizeLimitedString(value, "email", VALIDATION_LIMITS.email, { required }).toLowerCase();

  if (email && !validateEmail(email)) {
    throw createValidationError("Invalid email format");
  }

  return email;
};

export const validatePasswordLength = (password, fieldName = "password") => {
  if (typeof password !== "string" || !password) {
    throw createValidationError(`${fieldName} is required`);
  }

  if (password.length > VALIDATION_LIMITS.password) {
    throw createValidationError(`${fieldName} must be at most ${VALIDATION_LIMITS.password} characters`);
  }

  if (password.trim().length < 6) {
    throw createValidationError(`${fieldName} must be at least 6 characters long`);
  }

  return password;
};

export const parseLimitedNumber = (
  value,
  fieldName,
  { min = 0, max = Number.MAX_SAFE_INTEGER, integer = false } = {},
) => {
  if (value === undefined || value === null || value === "") {
    throw createValidationError(`${fieldName} is required`);
  }

  if (typeof value === "string" && !/^-?\d+(\.\d+)?$/.test(value.trim())) {
    throw createValidationError(`${fieldName} must be a valid number`);
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw createValidationError(`${fieldName} must be a valid number`);
  }

  if (integer && !Number.isInteger(parsed)) {
    throw createValidationError(`${fieldName} must be an integer`);
  }

  if (parsed < min || parsed > max) {
    throw createValidationError(`${fieldName} must be between ${min} and ${max}`);
  }

  return parsed;
};

export const parseQuantity = (value, { allowZero = false } = {}) =>
  parseLimitedNumber(value, "quantity", {
    ...NUMBER_LIMITS.quantity,
    min: allowZero ? 0 : 1,
    integer: true,
  });
