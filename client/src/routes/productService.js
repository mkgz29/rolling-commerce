import { apiFetch } from "./api";

export const getProductsService = () =>
  apiFetch("/products");

export const getProductByIdService = (id) =>
  apiFetch(`/products/${id}`);