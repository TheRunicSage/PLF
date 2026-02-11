const POST_TYPES = new Set(['news', 'story', 'blog', 'press', 'event']);
const PROJECT_STATUSES = new Set(['ongoing', 'completed', 'upcoming']);

const isEmpty = (value) => typeof value !== 'string' || value.trim().length === 0;
const hasValue = (value) => value !== undefined && value !== null;
const isValidUrl = (value) => {
  try {
    const parsed = new URL(String(value).trim());
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (_error) {
    return false;
  }
};

export const validateContactInput = (payload = {}) => {
  const details = {};

  if (isEmpty(payload.name)) {
    details.name = 'Name is required.';
  }

  if (isEmpty(payload.email)) {
    details.email = 'Email is required.';
  } else {
    const email = String(payload.email).trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      details.email = 'Please enter a valid email address.';
    }
  }

  if (isEmpty(payload.message)) {
    details.message = 'Message is required.';
  }

  return {
    isValid: Object.keys(details).length === 0,
    details,
  };
};

export const validatePostInput = (payload = {}, { isUpdate = false } = {}) => {
  const details = {};

  if (isEmpty(payload.title)) {
    details.title = 'Title is required.';
  }

  if (isEmpty(payload.content)) {
    details.content = 'Content is required.';
  }

  if (isEmpty(payload.type)) {
    details.type = 'Type is required.';
  } else if (!POST_TYPES.has(String(payload.type).trim())) {
    details.type = 'Type must be one of: news, story, blog, press, event.';
  }

  if (isUpdate && !hasValue(payload.published)) {
    details.published = 'Published flag is required for updates.';
  }

  if (hasValue(payload.published) && typeof payload.published !== 'boolean') {
    details.published = 'Published must be true or false.';
  }

  if (hasValue(payload.videoUrl) && !isEmpty(payload.videoUrl) && !isValidUrl(payload.videoUrl)) {
    details.videoUrl = 'Video URL must be a valid http or https URL.';
  }

  return {
    isValid: Object.keys(details).length === 0,
    details,
  };
};

export const validateProjectInput = (payload = {}) => {
  const details = {};

  if (isEmpty(payload.title)) {
    details.title = 'Title is required.';
  }

  if (isEmpty(payload.shortDescription)) {
    details.shortDescription = 'Short description is required.';
  }

  if (!isEmpty(payload.status) && !PROJECT_STATUSES.has(String(payload.status).trim())) {
    details.status = 'Status must be one of: ongoing, completed, upcoming.';
  }

  return {
    isValid: Object.keys(details).length === 0,
    details,
  };
};
