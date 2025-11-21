/**
 * SEO Utilities for dynamic canonical URLs and meta tags
 */

/**
 * Get the base URL based on environment
 * @returns {string} Base URL for the current environment
 */
export function getBaseUrl() {
  // Production domain
  const productionDomain = 'https://tv-even-center.vercel.app'
  
  // Development check
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  
  // Vercel deployment check
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Fallback to production domain
  return productionDomain
}

/**
 * Generate canonical URL for a given path
 * @param {string} path - The path/route (with or without leading slash)
 * @returns {string} Full canonical URL
 */
export function getCanonicalUrl(path = '') {
  const baseUrl = getBaseUrl()
  
  // Handle different path formats
  let cleanPath = path
  
  // Remove leading slash if present, we'll add it back
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1)
  }
  
  // Handle empty path (home page)
  if (!cleanPath || cleanPath === '') {
    return baseUrl
  }
  
  // Return full canonical URL
  return `${baseUrl}/${cleanPath}`
}

/**
 * Generate metadata for App Router
 * @param {Object} options - Metadata options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description  
 * @param {string} options.path - Current path/route
 * @param {string} options.ogImage - Open Graph image URL
 * @param {Array<string>} options.keywords - Page keywords
 * @param {boolean} options.noindex - Whether to noindex the page
 * @returns {Object} Next.js metadata object
 */
export function generateMetadata({
  title,
  description,
  path = '',
  ogImage,
  keywords = [],
  noindex = false
}) {
  const canonicalUrl = getCanonicalUrl(path)
  const baseUrl = getBaseUrl()
  
  const fullTitle = title ? `${title} | TVS Event Center` : 'TVS Event Center - Celebrate Life\'s Best Moments'
  const fullDescription = description || 'TVS Event Center is a luxurious event venue perfect for weddings, corporate events, birthdays, and celebrations. Located in Rosharan, TX with state-of-the-art facilities.'
  
  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords.length > 0 ? keywords : ['event venue', 'wedding hall', 'corporate events', 'birthday parties', 'luxury venue', 'event center', 'Rosharon TX'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      title: fullTitle,
      description: fullDescription,
      siteName: 'TVS Event Center',
      images: ogImage ? [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      creator: '@tvseventcenter',
      images: ogImage ? [ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`] : undefined,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/**
 * Get current path from URL for client-side usage
 * @returns {string} Current pathname
 */
export function getCurrentPath() {
  if (typeof window !== 'undefined') {
    return window.location.pathname
  }
  return ''
}