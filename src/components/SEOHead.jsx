'use client'

import Head from 'next/head'

export default function SEOHead({ 
  title, 
  description, 
  canonical, 
  ogImage,
  noindex = false,
  keywords 
}) {
  const baseUrl = 'https://tv-even-center.vercel.app'
  const fullCanonical = canonical?.startsWith('http') ? canonical : `${baseUrl}${canonical || ''}`
  const fullTitle = title ? `${title} | TVS Event Center` : 'TVS Event Center - Celebrate Life\'s Best Moments'
  const fullDescription = description || 'TVS Event Center is a luxurious event venue perfect for weddings, corporate events, birthdays, and celebrations. Located in Rosharon, TX with state-of-the-art facilities.'

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TVS Event Center" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
    </Head>
  )
}