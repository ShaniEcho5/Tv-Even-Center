'use client'

import HeroSection from '@/components/HeroSection'
import SectionHeading from '@/components/SectionHeading'
import CardGrid from '@/components/CardGrid'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DiamondServicesSection from '@/components/DiamondServicesSection'
import SEOHead from '@/components/SEOHead'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star, Users, Calendar, MapPin, Award, Heart, Crown } from 'lucide-react'
import { services } from '@/data/services'
import { venueHalls } from '@/data/venueHalls'
import { testimonials } from '@/data/testimonials'
import { companyInfo } from '@/data/companyInfo'
import { galleryImages } from '@/data/gallery'

export default function HomePage() {
  const featuredServices = services.slice(0, 6)
  const featuredVenues = venueHalls.slice(0, 3)
  const featuredTestimonials = testimonials.slice(0, 3)
  const featuredGallery = galleryImages.slice(0, 8)

  return (
    <>
      <SEOHead 
        title="TVS Event Center - Celebrate Life's Best Moments"
        description="Premier event venue in Rosharon, TX. Perfect for weddings, corporate events, birthdays & celebrations. State-of-the-art facilities, catering & DJ services."
        canonical="/"
        keywords="event venue, wedding hall, corporate events, birthday parties, luxury venue, event center, Rosharon TX, catering, DJ services"
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Diamond Services Section - Hidden on Mobile */}
        <div className="hidden md:block">
          <DiamondServicesSection />
        </div>

        {/* About Preview Section */}
        <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <SectionHeading
                  subtitle="About TVS Event Center"
                  title="Where Dreams Come to Life"
                  description={companyInfo.description}
                  centered={false}
                />
                
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                    <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-gold-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{companyInfo.maxCapacity}</div>
                    <div className="text-sm text-gray-600">Max Capacity</div>
                  </div>
                  <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                    <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-gold-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{companyInfo.totalArea}</div>
                    <div className="text-sm text-gray-600">Total Space</div>
                  </div>
                </div>
{/* 
                <div className="mt-8">
                  <Link href="/about" className="btn-primary inline-flex items-center">
                    Learn More About Us
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div> */}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <Image
                      src="/images/tvevent34.jpg"
                      alt="Elegant wedding setup"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-32 rounded-2xl overflow-hidden">
                    <Image
                      src="/images/tvevent35.jpg"
                      alt="Corporate event setup"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="relative h-32 rounded-2xl overflow-hidden">
                    <Image
                      src="/images/tvevent36.jpg"
                      alt="Birthday celebration"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <Image
                      src="/images/tvevent34.jpg"
                      alt="Outdoor garden event"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Our Services"
              title="Creating Unforgettable Experiences"
              description="From intimate gatherings to grand celebrations, we provide comprehensive event services tailored to your unique vision."
            />
            
            <div className="mt-16">
              <CardGrid items={featuredServices} type="services" />
            </div>

            <div className="text-center mt-12">
              <Link href="/services" className="btn-secondary">
                View All Services
              </Link>
            </div>
          </div>
        </section>

        {/* Venue Halls Preview */}
        <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Our Venues"
              title="Stunning Spaces for Every Occasion"
              description="Choose from our collection of beautifully designed halls and outdoor spaces, each offering unique features and ambiance."
            />
            
            <div className="mt-16">
              <CardGrid items={featuredVenues} type="venues" />
            </div>

            <div className="text-center mt-12">
              <Link href="/gallery" className="btn-secondary">
                Explore All Venues
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="section-padding bg-gradient-to-br from-gold-50 to-accent/5">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Transparent Pricing"
              title="Our Venue Packages"
              description="Simple, straightforward pricing with everything you need for your perfect event."
              centered={true}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
              {/* Main Package */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-gold-600"></div>
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-heading mb-2">Venue Rental</h3>
                  <div className="text-5xl font-bold text-heading mb-2">
                    ${companyInfo.pricing.basePrice}
                    <span className="text-lg font-normal text-gray-600"> {companyInfo.pricing.taxNote}</span>
                  </div>
                  <p className="text-gray-600">Complete venue package</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Daytime Events</span>
                    <span className="font-semibold text-accent">{companyInfo.pricing.timeSlots.daytime.hours}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Evening Events</span>
                    <span className="font-semibold text-accent">{companyInfo.pricing.timeSlots.evening.hours}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border-2 border-accent/20">
                    <span className="text-gray-700">Cleaning Fee</span>
                    <span className="font-bold text-accent">${companyInfo.pricing.cleaning.fee}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-heading mb-3">What's Included:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <Star className="w-4 h-4 text-accent mr-2" />
                      <span>Full venue access</span>
                    </li>
                    <li className="flex items-center">
                      <Users className="w-4 h-4 text-accent mr-2" />
                      <span>Capacity up to {companyInfo.maxCapacity}</span>
                    </li>
                    <li className="flex items-center">
                      <MapPin className="w-4 h-4 text-accent mr-2" />
                      <span>{companyInfo.totalArea} event space</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Services & Contact */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Available Services */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-heading mb-4">Available Services</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {companyInfo.services.map((service, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Crown className="w-5 h-5 text-accent mr-3" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact for Booking */}
                <div className="bg-gradient-to-br from-accent to-gold-600 text-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Ready to Book?</h3>
                  <p className="mb-4 opacity-90">
                    Contact {companyInfo.contact.contactPerson} to discuss your event and secure your date.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <span className="font-semibold">Phone:</span>
                      <a href={`tel:${companyInfo.contact.phone}`} className="ml-2 hover:underline">
                        {companyInfo.contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold">Address:</span>
                      <span className="ml-2 text-sm">{companyInfo.address.full}</span>
                    </div>
                  </div>

                  <Link 
                    href="/contact" 
                    className="inline-block bg-white text-accent px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Quote & Book Now
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Why Choose TVS Event Center"
              title="Excellence in Every Detail"
              description="We're committed to making your event extraordinary with our attention to detail, professional service, and luxurious amenities."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {[
                {
                  icon: Award,
                  title: "Award-Winning Service",
                  description: "Recognized for excellence in event management and customer satisfaction."
                },
                {
                  icon: Heart,
                  title: "Passionate Team",
                  description: "Our dedicated team treats every event with personal care and attention."
                },
                {
                  icon: Crown,
                  title: "Luxury Amenities",
                  description: "State-of-the-art facilities and premium amenities for your comfort."
                },
                {
                  icon: Star,
                  title: "5-Star Reviews",
                  description: "Consistently rated as the top event venue by our satisfied clients."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Our Gallery"
              title="Moments Worth Celebrating"
              description="Take a glimpse into the magical moments we've helped create for our clients over the years."
            />
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
            >
              {featuredGallery.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-12">
              <Link href="/gallery" className="btn-primary">
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Client Testimonials"
              title="What Our Clients Say"
              description="Don't just take our word for it. Here's what our satisfied clients have to say about their experience with TVS Event Center."
            />
            
            <div className="mt-16">
              <CardGrid items={featuredTestimonials} type="testimonials" />
            </div>

            <div className="text-center mt-12">
              <div className="inline-flex items-center space-x-2 text-gold-600">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold">4.9/5 Average Rating</span>
                <span className="text-gray-500">from 200+ reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-r from-gold-500 to-gold-600 text-white">
          <div className="max-w-4xl mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
                Ready to Create Your Perfect Event?
              </h2>
              <p className="text-xl mb-8 text-gold-100">
                Let us help you turn your vision into reality. Contact our expert team today for a personalized consultation and venue tour.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  href="/contact"
                  className="bg-white text-gold-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Book a Consultation
                </Link>
                <Link
                  href="tel:832-228-1066"
                  className="border-2 border-white text-white hover:bg-white hover:text-gold-600 font-semibold px-8 py-4 rounded-lg transition-all duration-300"
                >
                  Call Now: 832-228-1066
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}