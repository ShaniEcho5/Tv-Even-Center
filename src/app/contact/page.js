'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SectionHeading from '@/components/SectionHeading'
import ContactForm from '@/components/ContactForm'
import SEOHead from '@/components/SEOHead'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { contactInfo } from '@/data/testimonials'

export default function ContactPage() {
  return (
    <>
      <SEOHead 
        title="Contact Us"
        description="Contact TVS Event Center in Rosharon, TX. Get in touch for event bookings, venue inquiries, and more information about our luxury event space."
        canonical="/contact"
        keywords="contact TVS Event Center, event venue booking, Rosharon TX venue contact, event inquiry, venue rental"
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Contact TVS Event Center"
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
                Contact Us
              </p>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Let's Create Something Amazing
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                Ready to plan your perfect event? Get in touch with our expert team for personalized consultation and planning services.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Get In Touch"
              title="Start Planning Your Event"
              description="Fill out the form below and our event planning experts will get back to you within 24 hours with a personalized proposal."
            />
            
            <div className="mt-16">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Map & Location */}
        <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Visit Us"
              title="Find TVS Event Center"
              description="Located in the heart of the city with easy access and ample parking for all your guests."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
              {/* Contact Information Cards */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gold-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                      <p className="text-gray-600">
                        {contactInfo.address.street}<br />
                        {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zipCode}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gold-100 rounded-lg">
                      <Phone className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                      <p className="text-gray-600 mb-1">{contactInfo.phone}</p>
                      <p className="text-sm text-gray-500">Available 24/7 for urgent inquiries</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gold-100 rounded-lg">
                      <Mail className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-600 mb-1">{contactInfo.email}</p>
                      <p className="text-sm text-gray-500">We'll respond within 2 hours</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gold-100 rounded-lg">
                      <Clock className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                      <div className="text-gray-600 space-y-1 text-sm">
                        <p>Monday - Friday: {contactInfo.businessHours.weekdays}</p>
                        <p>Saturday: {contactInfo.businessHours.saturday}</p>
                        <p>Sunday: {contactInfo.businessHours.sunday}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Map */}
{/* Map */}
<motion.div
  initial={{ opacity: 0, x: 30 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="lg:col-span-2"
>
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-96 lg:h-full">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3472.766726705755!2d-95.43298080000001!3d29.494002799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640ed5619e3c595%3A0x6f41791509f91989!2sTVS%20Event%20Center!5e0!3m2!1sen!2sin!4v1763018901572!5m2!1sen!2sin"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="TVS Event Center Location"
    />
  </div>
</motion.div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}