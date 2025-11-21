'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SectionHeading from '@/components/SectionHeading'
import CardGrid from '@/components/CardGrid'
import SEOHead from '@/components/SEOHead'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Star } from 'lucide-react'
import { services } from '@/data/services'

export default function ServicesPage() {
  const serviceCategories = [
    { id: 'wedding', name: 'Weddings', count: services.filter(s => s.category === 'wedding').length },
    { id: 'corporate', name: 'Corporate', count: services.filter(s => s.category === 'corporate').length },
    { id: 'social', name: 'Social Events', count: services.filter(s => s.category === 'social').length },
    { id: 'religious', name: 'Religious', count: services.filter(s => s.category === 'religious').length }
  ]

  return (
    <>
      <SEOHead 
        title="Event Services"
        description="Comprehensive event services at TVS Event Center including weddings, corporate events, birthday parties, and special celebrations. Professional catering and DJ services available."
        canonical="/services"
        keywords="event services, wedding services, corporate event planning, birthday party services, catering services, DJ services, event planning"
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Professional event services"
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
                Our Services
              </p>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Complete Event Solutions
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                From intimate gatherings to grand celebrations, we provide comprehensive event services tailored to your unique vision and requirements.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="What We Offer"
              title="Exceptional Event Services"
              description="Our team of experienced professionals is dedicated to making every event extraordinary with attention to detail and personalized service."
            />
            
            <div className="mt-16">
              <CardGrid items={services} type="services" />
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Event Categories"
              title="Specialized Expertise"
              description="We specialize in various types of events, each requiring unique approaches and attention to specific details."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {serviceCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.count} specialized services</p>
                  <div className="text-gold-600 font-medium">Learn More →</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <SectionHeading
                  subtitle="What's Included"
                  title="Comprehensive Event Management"
                  description="Every service package includes our full-service approach to event planning and execution, ensuring your event is flawless from start to finish."
                  centered={false}
                />
                
                <div className="space-y-4 mt-8">
                  {[
                    'Professional event planning consultation',
                    'Venue setup and decoration services', 
                    'Audio-visual equipment and technical support',
                    'Catering coordination and menu planning',
                    'Photography and videography arrangements',
                    'Day-of event coordination and management',
                    '24/7 customer support throughout your event',
                    'Post-event cleanup and breakdown services'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="p-1 bg-gold-100 rounded-full flex-shrink-0">
                        <Check className="w-4 h-4 text-gold-600" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link href="/contact" className="btn-primary inline-flex items-center">
                    Get Your Quote
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/images/Professionalimg.jpg"
                  alt="Professional event setup"
                  fill
                  className="object-cover"
                />
              </motion.div>
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
                Ready to Plan Your Event?
              </h2>
              <p className="text-xl mb-8 text-gold-100">
                Let our experienced team help you create an unforgettable event. Contact us today for a personalized consultation.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  href="/contact"
                  className="bg-white text-gold-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Planning Today
                </Link>
                <Link
                  href="/gallery"
                  className="border-2 border-white text-white hover:bg-white hover:text-gold-600 font-semibold px-8 py-4 rounded-lg transition-all duration-300"
                >
                  View Our Work
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