import User from "../models/users.js";
import generateToken from "../utils/generateToken.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { VALIDATION_LIMITS } from "../constants/validationLimits.js";
import { sanitizeEmail, sanitizeLimitedString, validatePasswordLength } from "../utils/validators.js";

const validateAuthData = (data, type = "register") => {
  const { name, email, password } = data;
  let sanitizedName;

  if (type === "register") {
    sanitizedName = sanitizeLimitedString(name, "name", VALIDATION_LIMITS.name, { required: true });

    if (sanitizedName.length < 2) {
      throw new Error("Name must be at least 2 characters long");
    }
  }

  const sanitizedEmail = sanitizeEmail(email, { required: true });
  const validPassword = validatePasswordLength(password);

  return {
    name: sanitizedName,
    email: sanitizedEmail,
    password: validPassword,
  };
};

const registerUser = async ({ name, email, password }) => {
  const validatedData = validateAuthData({ name, email, password }, "register");

  const existingUser = await User.findOne({
    $or: [
      { email: validatedData.email },
      { name: validatedData.name },
    ],
  });

  if (existingUser) {
    if (existingUser.email === validatedData.email) {
      throw new Error("El email ya está registrado");
    }

    if (existingUser.name === validatedData.name) {
      throw new Error("El nombre ya está en uso");
    }
  }

  const user = await User.create({
    name: validatedData.name,
    email: validatedData.email,
    password: validatedData.password,
  });

  return user.toPublicJSON();
};

const loginUser = async ({ email, password }) => {
  const validatedData = validateAuthData({ email, password }, "login");

  const user = await User.findOne({ email: validatedData.email }).select("+password");

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  if (!user.isActive) {
    throw new Error("Tu cuenta está desactivada");
  }

  const isMatch = await user.comparePassword(validatedData.password);

  if (!isMatch) {
    throw new Error("Credenciales inválidas");
  }

  const token = generateToken(user);

  return {
    token,
    user: user.toPublicJSON(),
  };
};

const getUserById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user.toPublicJSON();
};

const updateUserProfile = async (userId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const allowedFields = ["name"];
  const fieldsToUpdate = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      const sanitizedValue = sanitizeLimitedString(updateData[field], field, VALIDATION_LIMITS.name, {
        required: true,
      });

      if (field === "name" && sanitizedValue.length < 2) {
        throw new Error("Name must be at least 2 characters long");
      }

      fieldsToUpdate[field] = sanitizedValue;
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No valid fields provided for update");
  }

  const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user.toPublicJSON();
};

const changeUserPassword = async (userId, oldPassword, newPassword) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  if (!oldPassword || !newPassword) {
    throw new Error("Both old and new passwords are required");
  }

  validatePasswordLength(newPassword, "newPassword");

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const samePassword = await user.comparePassword(newPassword);
  if (samePassword) {
    throw new Error("New password must be different from current password");
  }

  user.password = newPassword;
  await user.save();

  return {
    message: "Password updated successfully",
  };
};

const deactivateUser = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    message: "User account deactivated successfully",
    user: user.toPublicJSON(),
  };
};

const activateUser = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: true },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    message: "User account activated successfully",
    user: user.toPublicJSON(),
  };
};

const verifyToken = (token) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }

    return { valid: true };
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

export {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
  changeUserPassword,
  deactivateUser,
  activateUser,
  verifyToken,
  validateAuthData,
};

