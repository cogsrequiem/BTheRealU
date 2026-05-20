import express from "express";
import { getDailyGoalController, patchDailyGoalController, postDailyGoalController } from "../controller/dailyGoalController.js";
const router = express.Router({mergeParams:true})

router.get("/daily", getDailyGoalController);
router.post("/daily", postDailyGoalController);
router.patch("/daily/:dailyGoalId", patchDailyGoalController);

export default router