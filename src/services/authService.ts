import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "1h";

const jwt_key = process.env.JWT_KEY || "secret-key"

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, jwt_key, {
    expiresIn: JWT_EXPIRES_IN,
  });
};