import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";




// Read the token from the request
// Check if valid
export const authMiddleware = async (req,res, next) => {


  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({message:"Token missing"})
  }


  try {
    
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
   req.userId = decoded.userId;
      next()

  } catch (err) {
    console.log('Erreur verify:', err.message);
    return res.status(403).json({message: "Invalid or expired token"})
  }


};
