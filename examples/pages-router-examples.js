/**
 * Pages Router Examples - Documentation Only
 * 
 * This file contains examples for implementing Pages Router with dynamic SEO.
 * Each example should be created as separate files in your pages directory.
 */

// Documentation examples - not executable code
export const pagesRouterExamples = {
  description: "Pages Router implementation examples for TVS Event Center SEO",
  
  examples: {
    "_app.js": `
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
    `,
    
    "index.js": `
import PagesSEO from '@/components/PagesSEO'

export default function Home() {
  return (
    <>
      <PagesSEO 
        title="Home"
        description="TVS Event Center - Celebrate Life's Best Moments."
        keywords={['event venue', 'wedding hall', 'rosharon tx']}
        ogImage="/images/hero-image.jpg"
      />
      <div className="min-h-screen">
        <h1>Welcome to TVS Event Center</h1>
      </div>
    </>
  )
}
    `,
    
    "about.js": `
import PagesSEO from '@/components/PagesSEO'

export default function About() {
  return (
    <>
      <PagesSEO 
        title="About Us"
        description="Learn about TVS Event Center..."
        keywords={['about tvs event center', 'event venue story']}
        ogImage="/images/about-hero.jpg"
      />
      <div className="min-h-screen">
        <h1>About TVS Event Center</h1>
      </div>
    </>
  )
}
    `,
    
    "services/[slug].js": `
import { useRouter } from 'next/router'
import PagesSEO from '@/components/PagesSEO'

export default function ServicePage() {
  const router = useRouter()
  const { slug } = router.query
  
  return (
    <>
      <PagesSEO 
        title={\`Service: \${slug}\`}
        description={\`Professional \${slug} services at TVS Event Center\`}
        keywords={['tvs event center', 'services']}
      />
      <div>
        <h1>Service: {slug}</h1>
      </div>
    </>
  )
}
    `,
    
    "contact.js": `
import { withSEO } from '@/components/PagesSEO'

function Contact() {
  return (
    <div className="min-h-screen">
      <h1>Contact Us</h1>
    </div>
  )
}

export default withSEO(Contact, {
  title: 'Contact Us',
  description: 'Get in touch with TVS Event Center...',
  keywords: ['contact tvs event center', 'book event venue'],
  ogImage: '/images/contact-hero.jpg'
})
    `
  }
}