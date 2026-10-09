import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    jobUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Job URL must start with http:// or https://',
      },
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
      default: '',
    },
    workMode: {
      type: String,
      enum: {
        values: ['In-office', 'Remote', 'Hybrid'],
        message: '{VALUE} is not a valid work mode',
      },
      default: 'Remote',
    },
    employmentType: {
      type: String,
      enum: {
        values: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        message: '{VALUE} is not a valid employment type',
      },
      default: 'Full-time',
    },
    status: {
      type: String,
      enum: {
        values: ['Applied', 'Interview', 'Offer', 'Rejected'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Applied',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      default: null,
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    recruiterName: {
      type: String,
      trim: true,
      maxlength: [100, 'Recruiter name cannot exceed 100 characters'],
      default: '',
    },
    recruiterEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid recruiter email address',
      },
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching & filtering
applicationSchema.index({ company: 'text', jobTitle: 'text' });
applicationSchema.index({ status: 1 });
applicationSchema.index({ applicationDate: -1 });

export const Application = mongoose.model('Application', applicationSchema);
