import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

// Read the token from the request
// Check if valid
export const authMiddleware = async () => {
  console.log("Auth middleware reached");
};
