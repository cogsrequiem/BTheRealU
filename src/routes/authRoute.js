import express from "express";
const router = express.Router();

router.post("/register", (req, res) => {
  res.json({ message: "Registered" });
});

router.post("/login", (req, res) => {
  res.send("Login successful!");
});

export default router;
