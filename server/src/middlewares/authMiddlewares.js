// MÓDULO: Auth (compartido con Users y Cart)
// protect: verifica el token JWT y carga el usuario en req.user.
// admin: verifica que req.user.role sea "admin". Siempre usar después de protect.
// Uso en rutas: router.get("/ruta", protect, admin, controller)
// El token debe enviarse en el header: Authorization: Bearer <token>
import jwt from "jsonwebtoken";
import User from "../models/users.js";
// Middleware principal de autenticación.
// Si el token es válido y el usuario está activo, carga req.user y llama a next().
// Si el token es inválido o el usuario está inactivo, corta la cadena con 401.
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await
        User.findById(decoded.id).select("-password");

        if (!user || user.isActive === false) {
          return res.status(401).json({ message: "User unauthorized" });
        }
        req.user = user;
        next();
    } else {
      return res.status(401).json({ message: "unauthorized" });
    }

  } catch (error) {
    return res.status(401).json({ message: "invalid token" });
  }
};

// Middleware de autorización de rol.
// Solo deja pasar si req.user.role === "admin".
// Siempre usar después de protect — depende de que req.user ya esté cargado.
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};