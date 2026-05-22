import mongoose from "mongoose";
import { CONTACT_STATUSES } from "../constants/contactStatuses.js";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 80,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: CONTACT_STATUSES,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ email: 1, createdAt: -1 });

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
