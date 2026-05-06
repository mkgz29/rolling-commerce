import { apiFetch } from "./api";

export const createOrderService = () =>
  apiFetch("/orders", {
    method: "POST",
  });

export const getOrdersService = () =>
  apiFetch("/orders");

export const getOrderByIdService = (id) =>
  apiFetch(`/orders/${id}`);