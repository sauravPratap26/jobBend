import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error generating token");
  }
};
const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (
      [fullName, email, phoneNumber, password, role].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All Fields are required");
    }
    const existedUser = await User.findOne({
      $or: [{ phoneNumber }, { email }],
    });
    if (existedUser) {
      console.log(existedUser);
      throw new ApiError(409, "User Data already exists!!");
    } else {
      await User.create({
        fullName,
        email,
        phoneNumber,
        password,
        role,
      });
    }
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered Successfully"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if ([email, password, role].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "Please fill all the fields before login");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, "User does not exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid Credentials");
    }

    const isRoleCorrect = await user.isRoleCorrect(role);
    if (!isRoleCorrect) {
      throw new ApiError(401, "User does not exist for this role!");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          `Welcome Back ${loggedInUser.fullName}`
        )
      );
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged Out"));
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile= async(req,res)=>{
    try {
    const { bio,skills} = req.body;
    if (!bio && !skills) {
        throw new ApiError(400,"Nothing there to update")
      }

    // if ([email, password, role].some((field) => field?.trim() === "")) {
    //   throw new ApiError(400, "Please fill all the fields before login");
    // }
    const skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : undefined;
    const user= await User.findById(req.user._id)

    if (skillsArray) user.profile.skills = skillsArray;
    if (bio) user.profile.bio = bio;
    await user.save({validateBeforeSave: false})
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Profile updated successfully"))
        
    } catch (error) {
        return res.status(error.code || 500).json({
            success: false,
            message: error.message,
          });
    }
}