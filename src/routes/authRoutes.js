import express from "express";
import { registerUser, login, logout } from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginSchema, registerSchema } from "../validator/authValidator.js";
const router = express.Router();

// router.use(authMiddleware);

router.post("/register", validateRequest(registerSchema), registerUser);

router.post("/login", validateRequest(loginSchema), login);

router.post("/logout", logout);

export default router;
