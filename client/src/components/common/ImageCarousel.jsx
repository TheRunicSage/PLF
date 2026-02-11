import { useEffect, useMemo, useState } from 'react';

const ImageCarousel = ({
  images = [],
  altBase = 'Gallery image',
  className = '',
}) => {
  const sanitizedImages = useMemo(() => {
    if (!Array.isArray(images)) {
      return [];
    }

    return images.filter((item) => typeof item === 'string' && item.trim().length > 0);
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = sanitizedImages.length > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [sanitizedImages]);

  if (sanitizedImages.length === 0) {
    return null;
  }

  const goTo = (index) => {
    if (!hasMultiple) {
      return;
    }

    const total = sanitizedImages.length;
    const next = (index + total) % total;
    setActiveIndex(next);
  };

  return (
    <div className={`image-carousel ${className}`.trim()}>
      <div className="image-carousel__viewport">
        <img
          src={sanitizedImages[activeIndex]}
          alt={`${altBase} ${activeIndex + 1}`}
          loading="lazy"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              className="image-carousel__nav image-carousel__nav--prev"
              aria-label="Previous image"
              onClick={() => goTo(activeIndex - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="image-carousel__nav image-carousel__nav--next"
              aria-label="Next image"
              onClick={() => goTo(activeIndex + 1)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="image-carousel__dots" role="tablist" aria-label="Image gallery">
          {sanitizedImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              className={`image-carousel__dot ${index === activeIndex ? 'is-active' : ''}`.trim()}
              aria-label={`Go to image ${index + 1}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
