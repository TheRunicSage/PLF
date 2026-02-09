import Project from '../models/Project.js';
import { sendError, sendSuccess } from '../utils/httpResponse.js';

const ALLOWED_PROJECT_STATUSES = new Set(['ongoing', 'completed', 'upcoming']);

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
};

const parseBoolean = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();

  if (['true', '1', 'yes'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no'].includes(normalized)) {
    return false;
  }

  return undefined;
};

export const getPublicProjects = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const limit = Math.min(parsePositiveInt(req.query.limit, 10), 50);
    const status = req.query.status ? String(req.query.status).trim() : undefined;
    const highlighted = parseBoolean(req.query.highlighted);

    const filter = {};

    if (status !== undefined) {
      if (!ALLOWED_PROJECT_STATUSES.has(status)) {
        return sendError(res, 400, 'Invalid status query parameter.');
      }

      filter.status = status;
    }

    if (highlighted !== undefined) {
      filter.isHighlighted = highlighted;
    }

    const [items, totalItems] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Project.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      items,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getPublicProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).lean();

    if (!project) {
      return sendError(res, 404, 'Project not found.');
    }

    return sendSuccess(res, project);
  } catch (error) {
    return next(error);
  }
};
