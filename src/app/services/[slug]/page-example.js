/**
 * Example: Dynamic route with SEO metadata
 * This shows how to handle canonical URLs for dynamic routes like /services/[slug]
 */

import { generateMetadata as generateSEOMetadata } from '@/lib/seo-utils'
import { notFound } from 'next/navigation'

// Mock data - replace with your actual data fetching
const services = {
  'wedding-planning': {
    title: 'Wedding Planning Services',
    description: 'Complete wedding planning services at TVS Event Center. From intimate ceremonies to grand celebrations, we make your special day perfect.',
  },
  'corporate-events': {
    title: 'Corporate Events',
    description: 'Professional corporate event planning and venue services. Host meetings, conferences, and company celebrations at TVS Event Center.',
  },
  'birthday-parties': {
    title: 'Birthday Party Venues',
    description: 'Celebrate birthdays in style at TVS Event Center. Custom party planning for all ages with catering and entertainment options.',
  }
}

// Dynamic metadata for service pages
export async function generateMetadata({ params }) {
  const { slug } = params
  const service = services[slug]
  
  if (!service) {
    return {
      title: 'Service Not Found'
    }
  }
  
  return generateSEOMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${slug}`, // Dynamic path based on slug
    keywords: [`${service.title.toLowerCase()}`, 'tvs event center', 'rosharon tx', 'event services'],
    ogImage: `/images/services/${slug}.jpg`
  })
}

export default function ServicePage({ params }) {
  const { slug } = params
  const service = services[slug]
  
  if (!service) {
    notFound()
  }
  
  return (
    <div className="min-h-screen">
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      {/* Your service page content */}
    </div>
  )
}

// Generate static params for build optimization (optional)
export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({
    slug,
  }))
}