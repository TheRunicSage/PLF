export const mergeImageUrls = (...collections) => {
  const merged = [];
  const seen = new Set();

  collections.forEach((entry) => {
    if (Array.isArray(entry)) {
      entry.forEach((value) => {
        const normalized = typeof value === 'string' ? value.trim() : '';
        if (!normalized || seen.has(normalized)) {
          return;
        }

        seen.add(normalized);
        merged.push(normalized);
      });
      return;
    }

    const normalized = typeof entry === 'string' ? entry.trim() : '';
    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    merged.push(normalized);
  });

  return merged;
};

export const getPrimaryImage = (primary, gallery = []) => {
  const images = mergeImageUrls(primary, gallery);
  return images[0] || '';
};

export const parseImageLines = (value) => {
  if (typeof value !== 'string') {
    return [];
  }

  return mergeImageUrls(
    value
      .split(/\r?\n/g)
      .map((item) => item.trim())
      .filter(Boolean)
  );
};
