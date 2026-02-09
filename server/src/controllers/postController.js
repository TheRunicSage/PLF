import Post from '../models/Post.js';
import { sendError, sendSuccess } from '../utils/httpResponse.js';

const ALLOWED_POST_TYPES = new Set(['news', 'story', 'blog', 'press', 'event']);

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

export const getPublicPosts = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const limit = Math.min(parsePositiveInt(req.query.limit, 10), 50);
    const type = req.query.type ? String(req.query.type).trim() : undefined;
    const featured = parseBoolean(req.query.featured);

    const filter = { published: true };

    if (type !== undefined) {
      if (!ALLOWED_POST_TYPES.has(type)) {
        return sendError(res, 400, 'Invalid type query parameter.');
      }

      filter.type = type;
    }

    if (featured !== undefined) {
      filter.isFeatured = featured;
    }

    const [items, totalItems] = await Promise.all([
      Post.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
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

export const getPublicPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true }).lean();

    if (!post) {
      return sendError(res, 404, 'Post not found.');
    }

    return sendSuccess(res, post);
  } catch (error) {
    return next(error);
  }
};

export const getUpcomingEvents = async (req, res, next) => {
  try {
    const limit = Math.min(parsePositiveInt(req.query.limit, 5), 50);
    const now = new Date();

    const items = await Post.find({
      published: true,
      type: 'event',
      eventStartDate: { $gt: now },
    })
      .sort({ eventStartDate: 1 })
      .limit(limit)
      .lean();

    return sendSuccess(res, { items });
  } catch (error) {
    return next(error);
  }
};
