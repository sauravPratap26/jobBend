import ApiError from "../utils/ApiError.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const applyJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;
    if (!jobId) {
      throw new ApiError(400, "JOB id is required");
    }

    //check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    //if both are found the existingApplication is true

    if (existingApplication) {
      throw new ApiError(400, "You have already applied for this job");
    }
    const job = await Job.findById(jobId);

    if (!job) {
      throw new ApiError(400, "JOB not found");
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();
    return res
      .status(201)
      .json(new ApiResponse(200, job, "Application created successfully"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });
    if (!getAppliedJobs) {
      throw new ApiError(404, "No Applied Jobs");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, application, "Applied Jobs found !!"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      throw new ApiError(404, "NO applicants");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, job, "Applicants found for the job"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      throw new ApiError(404, "Status not found");
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      throw new ApiError(404, "Application to be updated not found");
    }
    application.status = status.toUpperCase();
    await application.save();
    return res
      .status(201)
      .json(new ApiResponse(200, application, "Status updated !!!"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export { applyJob, getAppliedJobs, getApplicants, updateStatus };
