'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SectionHeading from '@/components/SectionHeading'
import Gallery from '@/components/Gallery'
import SEOHead from '@/components/SEOHead'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { galleryCategories } from '@/data/gallery'

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch gallery images from database
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/gallery')
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images')
        }
        
        const data = await response.json()
        setGalleryImages(data.images)
      } catch (err) {
        console.error('Error fetching gallery images:', err)
        setError(err.message)
        // Fallback to static data if available
        try {
          const { galleryImages: staticImages } = await import('@/data/gallery')
          setGalleryImages(staticImages)
        } catch (importErr) {
          console.error('Failed to load fallback images:', importErr)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <main>
          <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0 bg-gray-200 animate-pulse" />
            <div className="relative z-10 text-center text-gray-600 max-w-4xl mx-auto container-padding">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p>Loading gallery...</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SEOHead 
        title="Gallery - Event Photos"
        description="Browse our stunning gallery of weddings, corporate events, and celebrations at TVS Event Center. See our beautiful venue and successful events in Rosharon, TX."
        canonical="/gallery"
        keywords="event gallery, wedding photos, corporate event photos, venue gallery, TVS Event Center photos"
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Beautiful event gallery"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>

          <div className="relative z-10 text-center text-white max-w-4xl mx-auto container-padding">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-gold-400 font-medium text-lg mb-4 uppercase tracking-wide">
                Our Gallery
              </p>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Moments Worth Celebrating
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                Explore our collection of beautifully captured events and see how we bring dreams to life.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Event Gallery"
              title="Captured Memories"
              description="Browse through our extensive collection of events we've had the honor to host. Each image tells a story of celebration, joy, and unforgettable moments."
            />
            
            <div className="mt-16">
              {error && !galleryImages.length ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">Failed to load gallery images</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <Gallery 
                  images={galleryImages} 
                  categories={galleryCategories}
                  showFilters={true}
                />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}