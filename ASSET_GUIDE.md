# Asset Guide

This project now uses **local assets only** for branding and key visuals.

## Rule
- Do not hotlink images from third-party sites.
- Place files in `client/public/assets/...` and reference with `/assets/...` paths.

## Current asset map

### Brand
- `client/public/assets/brand/plf-logo.png`
  - Used by header logo and favicon.
  - Recommended: square PNG, `256x256` or higher.

### About page
- `client/public/assets/about/khushwant-singh.jpeg`
- `client/public/assets/about/sanna-kaushal.jpeg`
  - Founder images.
  - Recommended replacement: JPG/PNG, at least `1200x1200` (square).

- `client/public/assets/about/about-header-bg.png`
  - Mission section background.
  - Recommended replacement: JPG/PNG, `1920x1080` (or wider).

- `client/public/assets/about/mission-portrait.png`
  - Circular mission portrait image.
  - Recommended replacement: JPG/PNG, `900x900` (square).

- `client/public/assets/about/library-on-wheels.png`
  - Bottom strip image on About page.
  - Recommended replacement: JPG/PNG, around `1920x900`.

### Content placeholders (seeded posts/projects)
- `client/public/assets/content/campaign-poster.svg`
- `client/public/assets/content/event-poster.svg`
  - Used by seeded sample data image URLs.
  - Recommended replacement: JPG/PNG, around `1600x1000`.

### Donate
- `client/public/assets/donate/gpay-upi-qr.png`
  - Default QR displayed on Donate/Home if no QR URLs are saved in admin settings.
  - Recommended replacement: square PNG, `900x900` or higher.

## How to replace an asset
1. Keep the same filename and path, overwrite the file.
2. Rebuild frontend:
   - `npm --prefix client run build`
3. Push and redeploy.

No code change is needed if path and filename stay the same.
