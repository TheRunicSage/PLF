const getYouTubeId = (rawUrl) => {
  const parsed = new URL(rawUrl);
  const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

  if (host === 'youtu.be') {
    return parsed.pathname.slice(1);
  }

  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (parsed.pathname === '/watch') {
      return parsed.searchParams.get('v');
    }

    if (parsed.pathname.startsWith('/shorts/')) {
      return parsed.pathname.split('/')[2] || '';
    }

    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.split('/')[2] || '';
    }
  }

  return '';
};

const getVimeoId = (rawUrl) => {
  const parsed = new URL(rawUrl);
  const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') {
    return '';
  }

  const parts = parsed.pathname.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1] : '';
};

export const getVideoEmbedData = (videoUrl) => {
  if (!videoUrl || typeof videoUrl !== 'string') {
    return null;
  }

  const normalized = videoUrl.trim();

  if (!normalized) {
    return null;
  }

  try {
    const youtubeId = getYouTubeId(normalized);

    if (youtubeId) {
      return {
        type: 'iframe',
        src: `https://www.youtube.com/embed/${youtubeId}`,
        title: 'YouTube video player',
      };
    }

    const vimeoId = getVimeoId(normalized);

    if (vimeoId) {
      return {
        type: 'iframe',
        src: `https://player.vimeo.com/video/${vimeoId}`,
        title: 'Vimeo video player',
      };
    }

    const parsed = new URL(normalized);
    const pathname = parsed.pathname.toLowerCase();

    if (pathname.endsWith('.mp4') || pathname.endsWith('.webm') || pathname.endsWith('.ogg')) {
      return {
        type: 'video',
        src: normalized,
        title: 'Video',
      };
    }

    return null;
  } catch (_error) {
    return null;
  }
};

export default getVideoEmbedData;
