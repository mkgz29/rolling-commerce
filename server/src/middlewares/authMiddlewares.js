import jwt from "jsonwebtoken";
import User from "../models/users.js";

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


export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};