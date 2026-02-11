const DEFAULT_MAX_DIMENSION = 1400;
const DEFAULT_QUALITY = 0.82;

const readFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Unable to read file "${file.name}".`));

    reader.readAsDataURL(file);
  });
};

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to process one of the selected images.'));
    image.src = src;
  });
};

const toOptimizedDataUrl = async (file, { maxDimension = DEFAULT_MAX_DIMENSION, quality = DEFAULT_QUALITY } = {}) => {
  if (!file || typeof file.type !== 'string' || !file.type.startsWith('image/')) {
    throw new Error(`"${file?.name || 'File'}" is not a valid image.`);
  }

  const sourceDataUrl = await readFileAsDataUrl(file);
  const sourceImage = await loadImage(sourceDataUrl);

  const ratio = Math.min(1, maxDimension / Math.max(sourceImage.width, sourceImage.height));
  const targetWidth = Math.max(1, Math.round(sourceImage.width * ratio));
  const targetHeight = Math.max(1, Math.round(sourceImage.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');

  if (!context) {
    return sourceDataUrl;
  }

  context.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);

  // Keep PNG transparent assets intact; otherwise compress to JPEG for smaller payloads.
  if (file.type === 'image/png') {
    return canvas.toDataURL('image/png');
  }

  return canvas.toDataURL('image/jpeg', quality);
};

export const filesToOptimizedDataUrls = async (
  fileList,
  { maxFiles = 12, maxDimension = DEFAULT_MAX_DIMENSION, quality = DEFAULT_QUALITY } = {}
) => {
  const files = Array.from(fileList || []).slice(0, maxFiles);

  if (files.length === 0) {
    return [];
  }

  const conversions = files.map((file) => toOptimizedDataUrl(file, { maxDimension, quality }));
  return Promise.all(conversions);
};
