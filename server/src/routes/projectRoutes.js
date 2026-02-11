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

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : value);
const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
    )
  );
};

const normalizeProjectPayload = (payload = {}, { isUpdate = false } = {}) => {
  const normalized = {
    ...payload,
    title: normalizeString(payload.title),
    slug: normalizeString(payload.slug),
    shortDescription: normalizeString(payload.shortDescription),
    longDescription: typeof payload.longDescription === 'string' ? payload.longDescription.trim() : payload.longDescription,
    status: normalizeString(payload.status),
  };

  if (!isUpdate || Object.prototype.hasOwnProperty.call(payload, 'imageUrls')) {
    normalized.imageUrls = normalizeStringArray(payload.imageUrls);
  }

  if (!isUpdate || Object.prototype.hasOwnProperty.call(payload, 'thumbnailUrl')) {
    normalized.thumbnailUrl = normalizeString(payload.thumbnailUrl) || '';
  }

  if (
    Array.isArray(normalized.imageUrls)
    && normalized.imageUrls.length > 0
    && (!normalized.thumbnailUrl || normalized.thumbnailUrl.length === 0)
  ) {
    normalized.thumbnailUrl = normalized.imageUrls[0];
  }

  return normalized;
};

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
    const payload = normalizeProjectPayload(req.body, { isUpdate: false });
    const validation = validateProjectInput(payload);

    if (!validation.isValid) {
      return sendError(res, 400, 'Validation failed', validation.details);
    }

    const project = await Project.create(payload);

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

    const payload = normalizeProjectPayload(req.body, { isUpdate: true });
    const validation = validateProjectInput(payload);

    if (!validation.isValid) {
      return sendError(res, 400, 'Validation failed', validation.details);
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 404, 'Project not found.');
    }

    Object.assign(project, payload);
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
