import express from "express";
import { deleteGoals, getGoals, patchGoals, postGoals } from "../controller/goalController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { patchGoalSchema, postGoalSchema } from "../validator/goalValidator.js";
import dailyGoalRoutes from "./dailyGoalRoutes.js"

const router = express.Router()

router.get("/",authMiddleware ,getGoals)
router.post("/create-goals", authMiddleware,validateRequest(postGoalSchema), postGoals)
router.patch("/:id", authMiddleware,validateRequest(patchGoalSchema), patchGoals)
router.delete("/:id", authMiddleware, deleteGoals)

router.use("/:goalId", authMiddleware, dailyGoalRoutes)

export default router