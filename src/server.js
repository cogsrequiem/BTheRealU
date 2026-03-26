import express from "express";
import authRoute from "./routes/authRoute.js";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

const app = express();
const port = 5001;

config();
connectDB();

// API Routes
app.use("/auth", authRoute);

const server = app.listen(port, () => {
  console.log(`Exemple app listening on port ${port}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
