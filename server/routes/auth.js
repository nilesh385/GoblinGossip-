import express from "express";
import { signup, login, validateToken } from "../controllers/authController.js";
import { upload } from "../middleware/upload.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", upload.single("profilePic"), signup);
router.post("/login", login);
router.get("/validate-user", authenticateUser, validateToken);

export default router;
