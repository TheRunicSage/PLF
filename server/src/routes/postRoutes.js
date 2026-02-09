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
    const validation = validatePostInput(req.body, { isUpdate: false });

    if (!validation.isValid) {
      return sendError(res, 400, 'Validation failed', validation.details);
    }

    const post = await Post.create(req.body);

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

    const validation = validatePostInput(req.body, { isUpdate: true });

    if (!validation.isValid) {
      return sendError(res, 400, 'Validation failed', validation.details);
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return sendError(res, 404, 'Post not found.');
    }

    Object.assign(post, req.body);
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
