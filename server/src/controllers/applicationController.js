import { Application } from '../models/Application.js';

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getApplications = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      q = '',
      status = 'All',
      workMode = 'All',
      employmentType = 'All',
      sortBy = 'applicationDate',
      sortOrder = 'desc',
    } = req.query;

    const filter = {};

    if (q.trim()) {
      const sanitizedQuery = escapeRegex(q.trim());
      const searchRegex = new RegExp(sanitizedQuery, 'i');
      filter.$or = [
        { company: searchRegex },
        { jobTitle: searchRegex },
        { location: searchRegex },
        { notes: searchRegex },
      ];
    }

    if (status !== 'All') {
      filter.status = status;
    }

    if (workMode !== 'All') {
      filter.workMode = workMode;
    }

    if (employmentType !== 'All') {
      filter.employmentType = employmentType;
    }

    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortDirection };

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Application.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application with ID '${id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const application = await Application.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Job application created successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application with ID '${id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job application updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application with ID '${id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job application deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
