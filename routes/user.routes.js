import express from "express";
import {
  userLogin,
  userLogout,
  getAllUsers,
  defaultLocation,
  createUser,
} from "../controller/user.controller.js";

import authUser from "../middleware/auth.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", userLogin);
router.get("/logout", userLogout);
router.get("/dashboard", authUser, getAllUsers);
router.get("/map/:id", authUser, defaultLocation);

export default router;
