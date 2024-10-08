import { Router } from "express";
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
} from "../controller/company.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(verifyJwt,registerCompany);
router.route("/get").get(verifyJwt,getCompany);
router.route("/get/:id").get(verifyJwt, getCompanyById);
router.route("/update-company/:id").post(verifyJwt, updateCompany);

export default router;
