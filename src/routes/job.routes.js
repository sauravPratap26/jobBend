import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controller/job.controller.js";

const router = Router();
router.route("/post-job").post(verifyJwt, postJob);
router.route("/get").get(verifyJwt, getAllJobs);
router.route("/get-admin-jobs").get(verifyJwt, getAdminJobs);
router.route("/get/:id").get(verifyJwt, getJobById);

export default router;
