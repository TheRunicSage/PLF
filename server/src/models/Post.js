import mongoose from 'mongoose';
import slugify from 'slugify';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ['news', 'story', 'blog', 'press', 'event'],
      default: 'news',
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    featuredImageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    videoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    categories: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    eventStartDate: {
      type: Date,
      default: null,
    },
    eventEndDate: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre('validate', function setSlug(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  next();
});

postSchema.pre('save', function setPublishedAt(next) {
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (!this.published) {
    this.publishedAt = null;
  }

  next();
});

postSchema.index({ published: 1, type: 1, publishedAt: -1 });
postSchema.index({ published: 1, isFeatured: 1, publishedAt: -1 });
postSchema.index({ type: 1, eventStartDate: 1, published: 1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
