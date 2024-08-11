import ApiError from "../utils/ApiError.js";
import { Job } from "../models/job.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId
    } = req.body;
    const userId = req.user._id;
console.log(req.body)
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position 
    ) {
      throw new ApiError(400, "All fields cannot be empty");
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      createdBy: userId
    });
    if (!job) {
      throw new ApiError(401, "Failed to create Job");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, job, "job created successfully"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      throw new ApiError(400, "No such type of job found");
    }
    return res.status(201).json(new ApiResponse(200, jobs, "job results"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
    // .populate({
    //   path: "application",
    // });
    if (!job) {
      throw new ApiError(404, "Job does not exist");
    }
    return res.status(404).json(new ApiResponse(200, job, "job found"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.user._id;
    const jobs = await Job.find({
      createdBy: adminId,
    })
    .populate({
      path: "company",
    });
    if(!jobs){
        throw new ApiError(404, "Job not found")
    }
    return res.status(200).json(new ApiResponse(200,jobs, "job found !"))
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export {postJob, getAllJobs, getJobById, getAdminJobs}