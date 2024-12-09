import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controller/application.controller.js";
const router = Router();

router.route("/apply/:id").post(verifyJwt, applyJob);
router.route("/get").get(verifyJwt, getAppliedJobs);
router.route("/:id/applicants").get(verifyJwt, getApplicants);
router.route("/status/:id/update").post(verifyJwt, updateStatus);

export default router;
