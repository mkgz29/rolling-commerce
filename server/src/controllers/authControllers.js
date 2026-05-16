import { registerUser, loginUser } from "../services/authService.js";

const registerValidationMessages = [
  "Name is required",
  "Name must be at least",
  "Email is required",
  "Invalid email format",
  "Password is required",
  "Password must be at least",
  "registrado",
  "en uso",
];

const isRegisterValidationError = (message) =>
  registerValidationMessages.some((validationMessage) => message.includes(validationMessage));

const isLoginValidationError = (message) =>
  message.includes("Email is required") ||
  message.includes("Invalid email format") ||
  message.includes("Password is required") ||
  message.includes("Password must be at least");

const isAuthError = (message) =>
  message.includes("Credenciales inválidas") || message.includes("desactivada");

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const user = await registerUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("[register] Error registering user:", error.message);

    if (error.statusCode === 400 || isRegisterValidationError(error.message)) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const authData = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    });

    res.status(200).json(authData);
  } catch (error) {
    console.error("[login] Error logging in:", error.message);

    if (error.statusCode === 400 || isLoginValidationError(error.message)) {
      return res.status(400).json({ message: error.message });
    }

    if (isAuthError(error.message)) {
      return res.status(401).json({ message: error.message });
    }

    res.status(500).json({ message: "Error logging in" });
  }
};
