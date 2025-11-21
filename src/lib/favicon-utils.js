/**
 * Favicon Configuration Utilities
 * Centralized favicon management for TVS Event Center
 */

// Favicon file path - Change this one place to update everywhere
export const FAVICON_PATH = '/tvs-event-fav.png'

/**
 * Get favicon configuration for Next.js metadata
 * @returns {Object} Icons configuration object
 */
export function getFaviconConfig() {
  return {
    icon: [
      { url: FAVICON_PATH, sizes: '32x32' },
      { url: FAVICON_PATH, sizes: '16x16', type: 'image/png' },
      { url: FAVICON_PATH, sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: FAVICON_PATH, sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: FAVICON_PATH.replace('.png', '.svg'), // Optional SVG version
        color: '#d97b15'
      }
    ]
  }
}

/**
 * Get favicon URL for use in components or manifest
 * @returns {string} Favicon file path
 */
export function getFaviconUrl() {
  return FAVICON_PATH
}

/**
 * Get favicon configuration for web manifest
 * @returns {Array} Array of icon objects for manifest
 */
export function getManifestIcons() {
  return [
    {
      src: FAVICON_PATH,
      sizes: '16x16',
      type: 'image/png'
    },
    {
      src: FAVICON_PATH, 
      sizes: '32x32',
      type: 'image/png'
    },
    {
      src: FAVICON_PATH,
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: FAVICON_PATH,
      sizes: '512x512', 
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: FAVICON_PATH,
      sizes: '180x180',
      type: 'image/png'
    }
  ]
}

/**
 * Get favicon configuration for app shortcuts
 * @returns {Array} Array of icon objects for shortcuts
 */
export function getShortcutIcons() {
  return [
    {
      src: FAVICON_PATH,
      sizes: '32x32'
    }
  ]
}