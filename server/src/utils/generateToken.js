import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET?.trim();

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is required to generate authentication tokens");
  }

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: "1d",
    }
  );
};

export default generateToken;
