import express from 'express';
import mongoose from 'mongoose';

import {
  getPublicProjectBySlug,
  getPublicProjects,
} from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Project from '../models/Project.js';
import { sendError, sendSuccess } from '../utils/httpResponse.js';
import { validateProjectInput } from '../utils/validate.js';

const router = express.Router();

router.get('/projects', getPublicProjects);
router.get('/projects/:slug', getPublicProjectBySlug);

router.get('/admin/projects', authMiddleware, async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const parsedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 50, 1), 100);
    const filter = {};

    if (status) {
      filter.status = String(status).trim();
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const [items, totalItems] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit)
        .lean(),
      Project.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      items,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / parsedLimit),
        currentPage: parsedPage,
        limit: parsedLimit,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/admin/projects', authMiddleware, async (req, res, next) => {
  try {
    const validation = validateProjectInput(req.body);

    if (!validation.isValid) {
      return sendError(res, 400, 'Validation failed', validation.details);
    }

    const project = await Project.create(req.body);

    return sendSuccess(res, project, 201);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 409, 'A project with this slug already exists.');
    }

    return next(error);
  }
});

router.put('/admin/projects/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid project id.');
    }

    const validation = validateProjectInput(req.body);

    if (!validation.isValid) {
      return sendError(res, 400, 'Validation failed', validation.details);
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 404, 'Project not found.');
    }

    Object.assign(project, req.body);
    await project.save();

    return sendSuccess(res, project);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 409, 'A project with this slug already exists.');
    }

    return next(error);
  }
});

router.delete('/admin/projects/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid project id.');
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return sendError(res, 404, 'Project not found.');
    }

    return sendSuccess(res, { deleted: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
