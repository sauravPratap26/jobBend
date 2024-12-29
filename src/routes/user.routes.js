import { Router } from "express";
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controller/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { singleUpload } from "../middleware/multer.js";
const router = Router();
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);

//secured routes
router.route("/logout").post(verifyJwt, logout);
router.route("/update-profile").post(verifyJwt, updateProfile);

export default router;