/**
 * SEO Testing Script
 * Run this to test canonical URL generation
 */

import { getBaseUrl, getCanonicalUrl, generateMetadata } from '../src/lib/seo-utils.js'

console.log('🧪 Testing SEO Utils...\n')

// Test base URL detection
console.log('📍 Base URL Tests:')
console.log('Current environment:', process.env.NODE_ENV || 'development')
console.log('Base URL:', getBaseUrl())
console.log('')

// Test canonical URL generation
console.log('🔗 Canonical URL Tests:')
const testPaths = [
  '',
  '/',
  'about',
  '/about',
  'services/wedding-planning',
  '/services/wedding-planning'
]

testPaths.forEach(path => {
  const canonical = getCanonicalUrl(path)
  console.log(`Path: "${path}" → Canonical: "${canonical}"`)
})
console.log('')

// Test metadata generation
console.log('📝 Metadata Generation Test:')
const metadata = generateMetadata({
  title: 'Test Page',
  description: 'This is a test page description',
  path: '/test-page',
  keywords: ['test', 'seo', 'canonical'],
  ogImage: '/images/test.jpg'
})

console.log('Generated metadata:')
console.log('- Title:', metadata.title)
console.log('- Description:', metadata.description)
console.log('- Canonical:', metadata.alternates.canonical)
console.log('- OG URL:', metadata.openGraph.url)
console.log('- OG Image:', metadata.openGraph.images?.[0]?.url)
console.log('')

console.log('✅ SEO Utils test completed!')

// Browser test function
if (typeof window !== 'undefined') {
  window.testSEO = function() {
    console.log('🔍 Browser SEO Test:')
    
    // Check for canonical tags
    const canonicals = document.querySelectorAll('link[rel="canonical"]')
    console.log(`Found ${canonicals.length} canonical tag(s)`)
    
    canonicals.forEach((canonical, index) => {
      console.log(`Canonical ${index + 1}:`, canonical.href)
    })
    
    // Check Open Graph
    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) {
      console.log('OG URL:', ogUrl.content)
    }
    
    // Current page info
    console.log('Current pathname:', window.location.pathname)
    console.log('Expected canonical:', getCanonicalUrl(window.location.pathname))
  }
  
  console.log('💡 Run testSEO() in browser console to test on any page')
}