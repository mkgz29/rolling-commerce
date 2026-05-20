import mongoose from "mongoose";
import { CONTACT_STATUSES } from "../constants/contactStatuses.js";
import ContactMessage from "../models/contactMessage.js";
import { createValidationError, sanitizeEmail, sanitizeLimitedString } from "../utils/validators.js";

const CONTACT_SORT_FIELDS = new Set(["createdAt", "updatedAt", "status"]);

const ensureMinLength = (value, fieldName, minLength) => {
  if (value.length < minLength) {
    throw createValidationError(`${fieldName} must be at least ${minLength} characters`);
  }
};

const validateContactPayload = (payload = {}) => {
  const name = sanitizeLimitedString(payload.name, "name", 50, { required: true });
  const email = sanitizeEmail(payload.email, { required: true });
  const phone = sanitizeLimitedString(payload.phone, "phone", 20);
  const subject = sanitizeLimitedString(payload.subject, "subject", 80, { required: true });
  const message = sanitizeLimitedString(payload.message, "message", 500, { required: true });

  ensureMinLength(name, "name", 2);
  ensureMinLength(subject, "subject", 4);
  ensureMinLength(message, "message", 12);

  if (phone && !/^[\d\s()+-]+$/.test(phone)) {
    throw createValidationError("phone has invalid characters");
  }

  return {
    name,
    email,
    phone,
    subject,
    message,
  };
};

export const createContactMessage = async (payload) => {
  const contactData = validateContactPayload(payload);
  return ContactMessage.create(contactData);
};

export const getAdminContactMessages = async ({
  status = null,
  search = null,
  sortBy = "-createdAt",
  page = 1,
  limit = 50,
} = {}) => {
  const filter = {};

  if (status) {
    if (!CONTACT_STATUSES.includes(status)) {
      throw createValidationError(`Status must be one of: ${CONTACT_STATUSES.join(", ")}`);
    }
    filter.status = status;
  }

  if (search && search.trim()) {
    const sanitizedSearch = sanitizeLimitedString(search, "search", 80);
    const searchRegex = new RegExp(String(sanitizedSearch).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { subject: searchRegex },
      { message: searchRegex },
    ];
  }

  const normalizedSort = String(sortBy || "-createdAt");
  const sortDirection = normalizedSort.startsWith("-") ? -1 : 1;
  const sortField = normalizedSort.replace(/^-/, "");
  const sortOptions = CONTACT_SORT_FIELDS.has(sortField)
    ? { [sortField]: sortDirection }
    : { createdAt: -1 };

  const parsedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 50, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;

  const [messages, total, pending] = await Promise.all([
    ContactMessage.find(filter).sort(sortOptions).skip(skip).limit(parsedLimit),
    ContactMessage.countDocuments(filter),
    ContactMessage.countDocuments({ status: "pending" }),
  ]);

  return {
    total,
    pending,
    page: parsedPage,
    limit: parsedLimit,
    messages,
  };
};

export const updateContactMessageStatus = async (id, status) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createValidationError("Invalid contact message ID format");
  }

  if (!CONTACT_STATUSES.includes(status)) {
    throw createValidationError(`Status must be one of: ${CONTACT_STATUSES.join(", ")}`);
  }

  const message = await ContactMessage.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!message) {
    const error = new Error("Contact message not found");
    error.statusCode = 404;
    throw error;
  }

  return message;
};

export const deleteContactMessage = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createValidationError("Invalid contact message ID format");
  }

  const message = await ContactMessage.findById(id);

  if (!message) {
    const error = new Error("Contact message not found");
    error.statusCode = 404;
    throw error;
  }

  await message.deleteOne();
  return message;
};
