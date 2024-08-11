import { Company } from "../models/company.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
const registerCompany = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new ApiError(400, "Company name is required");
    }
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      throw new ApiError(401, "Company with same name already exists");
    }
    const createdCompany = await Company.create({
      name: name,
      userId: req.user._id,
    });
    console.log(name)
    return res
      .status(201)
      .json(
        new ApiResponse(200, createdCompany, "Company registered Successfully")
      );
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompany = async (req, res) => {
  try {
    const userId = req.user._id;
    const companies = await Company.find({ userId }).select(
      "-createdAt -updatedAt"
    );
    if (!companies) {
      throw new ApiError(400, "No company found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, companies, "Companies found"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const existingCompany = await Company.findById(companyId);
    if (!existingCompany) {
      throw new ApiError(400, "Company does not exist");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, existingCompany, "Company Found"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const updateData = { name, description, website, location };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!company) {
      throw new ApiError(400, "Failed to update Company data");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, company, "Company data updated"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export { registerCompany, getCompany, getCompanyById, updateCompany };
