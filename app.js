import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

import connectDB from "./config/db.js";
connectDB();

import userRoutes from "./routes/user.routes.js";

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Test server is running!");
});

// Routes
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;

app
  .listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
