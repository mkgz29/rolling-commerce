import mongoose from "mongoose";
import User from "../models/users.js";
import { VALIDATION_LIMITS } from "../constants/validationLimits.js";
import { sanitizeEmail, sanitizeLimitedString, validatePasswordLength } from "../utils/validators.js";
export const createUser = async (req, res) => {
   
  try {
    const { name, email, password } = req.body || {};
    const sanitizedName = sanitizeLimitedString(name, "name", VALIDATION_LIMITS.name, { required: true });
    const sanitizedEmail = sanitizeEmail(email, { required: true });
    const validPassword = validatePasswordLength(password);

    const userExist = await User.findOne({ email: sanitizedEmail });

    if (userExist) {
        return res.status(400).json({ message: "El usuario ya existe" });
    }
    
    const user = await User.create({
      name: sanitizedName,
      email: sanitizedEmail,
      password: validPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error("[createUser]", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "error getting users" });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findById(id).select("-password");

    if (!user || user.isActive === false) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      req.user.role !== "admin" &&
      String(req.user._id) !== id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error(`[getUserById] id=${req.params.id}`, error);
    res.status(500).json({ message: "Error getting user" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findById(id);

    if (!user || user.isActive === false) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (
      req.user.role !== "admin" &&
      String(req.user._id) !== id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (name !== undefined) {
      user.name = sanitizeLimitedString(name, "name", VALIDATION_LIMITS.name, { required: true });
    }

    if (email !== undefined) {
      const sanitizedEmail = sanitizeEmail(email, { required: true });
      const emailExist = await User.findOne({ email: sanitizedEmail, _id: { $ne: id } });
      if (emailExist) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = sanitizedEmail;
    }

    if (password) user.password = validatePasswordLength(password);

    if (role && req.user.role === "admin") {
      user.role = role;
    }
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });

  } catch (error) {
    console.error(`[updateUser] id=${req.params.id}`, error);
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Error al actualizar usuario",
      error: error.message,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findById(id);

    if (!user || user.isActive === false) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      req.user.role !== "admin" &&
      String(req.user._id) !== id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      message: "User deactivated correctly",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });

  } catch (error) {
    console.error(`[deleteUser] id=${req.params.id}`, error);
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json(req.user);

  } catch (error) {
    console.error("[getMe]", error);
    res.status(500).json({ message: "Error getting profile" });
  }
};
