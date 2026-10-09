import { z } from 'zod';
import mongoose from 'mongoose';

const dateSchema = z.union([
  z.string().datetime({ message: 'Must be a valid ISO date string' }),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Must be formatted as YYYY-MM-DD' }),
  z.literal(''),
  z.null(),
]).optional().transform((val) => (val === '' ? null : val));

export const applicationSchema = z.object({
  company: z.string({
    required_error: 'Company name is required',
  }).trim().min(1, 'Company name cannot be empty').max(100, 'Company name must not exceed 100 characters'),
  
  jobTitle: z.string({
    required_error: 'Job title is required',
  }).trim().min(1, 'Job title cannot be empty').max(100, 'Job title must not exceed 100 characters'),
  
  jobUrl: z.union([
    z.string().url('Must be a valid HTTP or HTTPS URL'),
    z.literal(''),
    z.null(),
  ]).optional().transform(val => val === '' ? null : val),
  
  location: z.string().trim().max(100, 'Location must not exceed 100 characters').optional().default(''),
  
  workMode: z.enum(['In-office', 'Remote', 'Hybrid'], {
    errorMap: () => ({ message: 'Work mode must be In-office, Remote, or Hybrid' }),
  }).optional().default('Remote'),
  
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship'], {
    errorMap: () => ({ message: 'Employment type must be Full-time, Part-time, Contract, or Internship' }),
  }).optional().default('Full-time'),
  
  status: z.enum(['Applied', 'Interview', 'Offer', 'Rejected'], {
    errorMap: () => ({ message: 'Status must be Applied, Interview, Offer, or Rejected' }),
  }).optional().default('Applied'),
  
  applicationDate: dateSchema,
  deadline: dateSchema,
  interviewDate: dateSchema,
  followUpDate: dateSchema,
  
  recruiterName: z.string().trim().max(100, 'Recruiter name must not exceed 100 characters').optional().default(''),
  
  recruiterEmail: z.union([
    z.string().email('Must be a valid email address'),
    z.literal(''),
    z.null(),
  ]).optional().transform(val => val === '' ? null : val),
  
  notes: z.string().trim().max(2000, 'Notes must not exceed 2000 characters').optional().default(''),
});

export const updateApplicationSchema = applicationSchema.partial();

export const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().max(100, 'Search query cannot exceed 100 characters').optional().default(''),
  status: z.enum(['All', 'Applied', 'Interview', 'Offer', 'Rejected']).optional().default('All'),
  workMode: z.enum(['All', 'In-office', 'Remote', 'Hybrid']).optional().default('All'),
  employmentType: z.enum(['All', 'Full-time', 'Part-time', 'Contract', 'Internship']).optional().default('All'),
  sortBy: z.enum(['applicationDate', 'followUpDate', 'createdAt', 'company', 'status']).optional().default('applicationDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }
    next(error);
  }
};

export const validateQuery = (schema) => (req, res, next) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: formattedErrors,
      });
    }
    next(error);
  }
};

export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid Application ID format: '${id}'`,
    });
  }
  next();
};
