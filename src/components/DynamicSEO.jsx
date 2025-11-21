/**
 * App Router Dynamic SEO Component
 * Use this for Next.js 13+ App Router
 */

'use client'

import { usePathname } from 'next/navigation'
import { getCanonicalUrl, getBaseUrl } from '@/lib/seo-utils'
import { useEffect } from 'react'

export default function DynamicSEO({ 
  title, 
  description, 
  ogImage,
  keywords,
  noindex = false 
}) {
  const pathname = usePathname()
  
  useEffect(() => {
    // Remove any existing canonical tags to prevent duplicates
    const existingCanonical = document.querySelector('link[rel="canonical"]')
    if (existingCanonical) {
      existingCanonical.remove()
    }
    
    // Create and insert new canonical tag
    const canonicalUrl = getCanonicalUrl(pathname)
    const canonicalLink = document.createElement('link')
    canonicalLink.rel = 'canonical'
    canonicalLink.href = canonicalUrl
    document.head.appendChild(canonicalLink)
    
    // Update Open Graph URL if it exists
    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) {
      ogUrl.content = canonicalUrl
    } else {
      const newOgUrl = document.createElement('meta')
      newOgUrl.setAttribute('property', 'og:url')
      newOgUrl.content = canonicalUrl
      document.head.appendChild(newOgUrl)
    }
    
    // Update Twitter URL if needed
    const twitterUrl = document.querySelector('meta[name="twitter:url"]')
    if (twitterUrl) {
      twitterUrl.content = canonicalUrl
    }
    
    // Debug log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Dynamic SEO - Current path:', pathname, 'Canonical URL:', canonicalUrl)
    }
    
    // Cleanup function
    return () => {
      const currentCanonical = document.querySelector(`link[rel="canonical"][href="${canonicalUrl}"]`)
      if (currentCanonical) {
        currentCanonical.remove()
      }
    }
  }, [pathname])
  
  return null // This component doesn't render anything visible
}

/**
 * Hook for getting current canonical URL in App Router
 * @returns {string} Current canonical URL
 */
export function useCanonicalUrl() {
  const pathname = usePathname()
  return getCanonicalUrl(pathname)
}

/**
 * Hook for getting SEO metadata object for current route
 * @param {Object} options - SEO options
 * @returns {Object} SEO metadata
 */
export function useSEOMetadata(options = {}) {
  const pathname = usePathname()
  const canonicalUrl = getCanonicalUrl(pathname)
  const baseUrl = getBaseUrl()
  
  const {
    title,
    description = 'TVS Event Center is a luxurious event venue perfect for weddings, corporate events, birthdays, and celebrations. Located in Rosharon, TX with state-of-the-art facilities.',
    ogImage,
    keywords = [],
    noindex = false
  } = options
  
  const fullTitle = title ? `${title} | TVS Event Center` : 'TVS Event Center - Celebrate Life\'s Best Moments'
  
  return {
    title: fullTitle,
    description,
    canonicalUrl,
    ogImage: ogImage ? (ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`) : null,
    keywords,
    noindex,
    baseUrl
  }
}