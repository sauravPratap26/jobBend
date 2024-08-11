import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [
        {
          type: String,
          // Optionally add validation for non-empty requirements
          minlength: 1,
        },
      ],
      required: true,
    },
    salary: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experienceLevel:{
      type:Number,
      required:true,
  },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

// Optionally add indexes for performance improvement
// jobSchema.index({ location: 1 });
// jobSchema.index({ jobType: 1 });

export const Job = mongoose.model("Job", jobSchema);
