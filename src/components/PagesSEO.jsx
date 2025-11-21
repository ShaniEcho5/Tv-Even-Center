/**
 * Pages Router Dynamic SEO Component
 * Use this for Next.js Pages Router (pages directory)
 */

'use client'

import { useRouter } from 'next/router'
import Head from 'next/head'
import { getCanonicalUrl, getBaseUrl } from '@/lib/seo-utils'

export default function PagesSEO({ 
  title, 
  description, 
  ogImage,
  keywords = [],
  noindex = false 
}) {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0] // Remove query params
  
  const canonicalUrl = getCanonicalUrl(pathname)
  const baseUrl = getBaseUrl()
  
  const fullTitle = title ? `${title} | TVS Event Center` : 'TVS Event Center - Celebrate Life\'s Best Moments'
  const fullDescription = description || 'TVS Event Center is a luxurious event venue perfect for weddings, corporate events, birthdays, and celebrations. Located in Rosharon, TX with state-of-the-art facilities.'
  
  const keywordsString = keywords.length > 0 
    ? keywords.join(', ')
    : 'event venue, wedding hall, corporate events, birthday parties, luxury venue, event center, Rosharon TX'
  
  const fullOgImage = ogImage ? (ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`) : null
  
  // Debug log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Pages SEO - Current path:', pathname, 'Canonical URL:', canonicalUrl)
  }

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywordsString} />
      
      {/* Canonical URL - Dynamic based on current route */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TVS Event Center" />
      <meta property="og:locale" content="en_US" />
      {fullOgImage && (
        <>
          <meta property="og:image" content={fullOgImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={fullTitle} />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:creator" content="@tvseventcenter" />
      {fullOgImage && <meta name="twitter:image" content={fullOgImage} />}
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
    </Head>
  )
}

/**
 * Higher-order component for pages with automatic SEO
 * @param {React.Component} WrappedComponent - The page component to wrap
 * @param {Object} seoConfig - SEO configuration for the page
 * @returns {React.Component} Enhanced component with SEO
 */
export function withSEO(WrappedComponent, seoConfig = {}) {
  return function SEOWrappedComponent(props) {
    return (
      <>
        <PagesSEO {...seoConfig} />
        <WrappedComponent {...props} />
      </>
    )
  }
}