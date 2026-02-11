import express from 'express';
import mongoose from 'mongoose';

import {
  getPublicPostBySlug,
  getPublicPosts,
  getUpcomingEvents,
} from '../controllers/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Post from '../models/Post.js';
import { sendError, sendSuccess } from '../utils/httpResponse.js';
import { validatePostInput } from '../utils/validate.js';

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

const normalizePostPayload = (payload = {}, { isUpdate = false } = {}) => {
  const normalized = {
    ...payload,
    title: normalizeString(payload.title),
    slug: normalizeString(payload.slug),
    type: normalizeString(payload.type),
    excerpt: normalizeString(payload.excerpt),
    content: typeof payload.content === 'string' ? payload.content.trim() : payload.content,
    videoUrl: normalizeString(payload.videoUrl),
    location: normalizeString(payload.location),
    categories: Array.isArray(payload.categories) ? normalizeStringArray(payload.categories) : payload.categories,
    tags: Array.isArray(payload.tags) ? normalizeStringArray(payload.tags) : payload.tags,
  };

  if (!isUpdate || Object.prototype.hasOwnProperty.call(payload, 'imageUrls')) {
    normalized.imageUrls = normalizeStringArray(payload.imageUrls);
  }

  if (!isUpdate || Object.prototype.hasOwnProperty.call(payload, 'featuredImageUrl')) {
    normalized.featuredImageUrl = normalizeString(payload.featuredImageUrl) || '';
  }

  if (
    Array.isArray(normalized.imageUrls)
    && normalized.imageUrls.length > 0
    && (!normalized.featuredImageUrl || normalized.featuredImageUrl.length === 0)
  ) {
    normalized.featuredImageUrl = normalized.imageUrls[0];
  }

  return normalized;
};

router.get('/posts', getPublicPosts);
router.get('/posts/:slug', getPublicPostBySlug);
router.get('/events/upcoming', getUpcomingEvents);

router.get('/admin/posts', authMiddleware, async (req, res, next) => {
  try {
    const { type, search, published, page = 1, limit = 10 } = req.query;
    const parsedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 10, 1), 100);

    const filter = {};

    if (type) {
      filter.type = String(type).trim();
    }

    if (published !== undefined) {
      filter.published = String(published).trim().toLowerCase() === 'true';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit)
        .lean(),
      Post.countDocuments(filter),
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

router.post('/admin/posts', authMiddleware, async (req, res, next) => {
  try {
    const payload = normalizePostPayload(req.body, { isUpdate: false });
    const validation = validatePostInput(payload, { isUpdate: false });

    if (!validation.isValid) {
      return sendError(res, 400, 'Validation failed', validation.details);
    }

    const post = await Post.create(payload);

    return sendSuccess(res, post, 201);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 409, 'A post with this slug already exists.');
    }

    return next(error);
  }
});

router.put('/admin/posts/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid post id.');
    }

    const payload = normalizePostPayload(req.body, { isUpdate: true });
    const validation = validatePostInput(payload, { isUpdate: true });

    if (!validation.isValid) {
      return sendError(res, 400, 'Validation failed', validation.details);
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return sendError(res, 404, 'Post not found.');
    }

    Object.assign(post, payload);
    await post.save();

    return sendSuccess(res, post);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 409, 'A post with this slug already exists.');
    }

    return next(error);
  }
});

router.delete('/admin/posts/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid post id.');
    }

    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return sendError(res, 404, 'Post not found.');
    }

    return sendSuccess(res, { deleted: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
