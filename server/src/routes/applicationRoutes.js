import express from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController.js';
import { getStats } from '../controllers/statsController.js';
import {
  applicationSchema,
  updateApplicationSchema,
  querySchema,
  validateBody,
  validateQuery,
  validateObjectId,
} from '../validators/applicationValidator.js';

const router = express.Router();

// Stats endpoint
router.get('/stats', getStats);

// Application list endpoint
router.get('/', validateQuery(querySchema), getApplications);

// Application detail endpoint
router.get('/:id', validateObjectId, getApplicationById);

// Create application endpoint
router.post('/', validateBody(applicationSchema), createApplication);

// Update application endpoint
router.put('/:id', validateObjectId, validateBody(updateApplicationSchema), updateApplication);

// Delete application endpoint
router.delete('/:id', validateObjectId, deleteApplication);

export default router;
