import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "1h";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_KEY!, {
    expiresIn: JWT_EXPIRES_IN,
  });
};