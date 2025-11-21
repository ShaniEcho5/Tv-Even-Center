/**
 * Example: App Router page with dynamic SEO metadata
 * This shows how to implement dynamic canonical URLs in App Router pages
 */

import { generateMetadata as generateSEOMetadata } from '@/lib/seo-utils'

// Dynamic metadata generation for this specific page
export async function generateMetadata({ params, searchParams }) {
  // For dynamic routes, you can use params
  // For this example, it's a static about page
  
  return generateSEOMetadata({
    title: 'About Us',
    description: 'Learn about TVS Event Center, our story, mission, and commitment to creating unforgettable events in Rosharon, TX.',
    path: '/about', // Current page path
    keywords: ['about tvs event center', 'event venue story', 'rosharon event center', 'luxury venue team'],
    ogImage: '/images/about-hero.jpg' // Optional: page-specific image
  })
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <h1>About TVS Event Center</h1>
      {/* Your page content */}
    </div>
  )
}