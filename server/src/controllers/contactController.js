import {
  createContactMessage,
  deleteContactMessage,
  getAdminContactMessages,
  updateContactMessageStatus,
} from "../services/contactService.js";

export const createContactMessageController = async (req, res, next) => {
  try {
    const message = await createContactMessage(req.body);

    res.status(201).json({
      message: "Contact message created successfully",
      contactMessage: message,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminContactMessagesController = async (req, res, next) => {
  try {
    const messages = await getAdminContactMessages({
      ...req.query,
      sortBy: req.query.sortBy || "-createdAt",
    });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const updateContactMessageStatusController = async (req, res, next) => {
  try {
    const message = await updateContactMessageStatus(req.params.id, req.body.status);
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessageController = async (req, res, next) => {
  try {
    const message = await deleteContactMessage(req.params.id);

    res.status(200).json({
      message: "Contact message deleted successfully",
      contactMessageId: message._id,
    });
  } catch (error) {
    next(error);
  }
};
