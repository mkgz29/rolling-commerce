import { registerUser, loginUser } from "../services/authService.js";

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
    if (
      error.message.includes("registrado") ||
      error.message.includes("en uso") ||
      error.message.includes("Credenciales inválidas")
    ) {
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

    if (
      error.message.includes("Credenciales inválidas") ||
      error.message.includes("desactivada")
    ) {
      return res.status(401).json({ message: error.message });
    }

    res.status(500).json({ message: "Error logging in" });
  }
};
