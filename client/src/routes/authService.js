import { apiFetch } from "./api";

export const loginService = (email, password) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getMeService = () =>
  apiFetch("/users/me");