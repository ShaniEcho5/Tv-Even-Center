'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SectionHeading from '@/components/SectionHeading'
import SEOHead from '@/components/SEOHead'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Award, Users, Calendar, MapPin, Star, Heart, Crown, Clock, Shield, Sparkles } from 'lucide-react'
import { companyInfo } from '@/data/testimonials'

export default function AboutPage() {
  return (
    <>
      <SEOHead 
        title="About TVS Event Center"
        description="Learn about TVS Event Center - our story, mission, and commitment to creating extraordinary events. Luxury venue in Rosharon, TX with exceptional service."
        keywords="about TVS Event Center, event venue story, luxury event center, Rosharon TX venue, wedding venue history"
      />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="TVS Event Center interior"
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
                About TVS Event Center
              </p>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Creating Memories Since {companyInfo.established}
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                {companyInfo.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
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
                  subtitle="Our Story"
                  title="A Journey of Excellence"
                  description="Founded in 2015, TVS Event Center has been the premier destination for luxury events and celebrations. Our passion for creating extraordinary experiences has made us the most trusted name in event hosting."
                  centered={false}
                />
                
                <div className="space-y-6 mt-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gold-100 rounded-lg flex-shrink-0">
                      <Crown className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Luxury Redefined</h3>
                      <p className="text-gray-600">Every detail is crafted to perfection, from our state-of-the-art facilities to our personalized service approach.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gold-100 rounded-lg flex-shrink-0">
                      <Heart className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Passionate Service</h3>
                      <p className="text-gray-600">Our dedicated team treats every event with personal care, ensuring your celebration is as unique as your vision.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gold-100 rounded-lg flex-shrink-0">
                      <Star className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven Excellence</h3>
                      <p className="text-gray-600">With over 1000+ successful events and countless satisfied clients, we've established ourselves as industry leaders.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/tvevent35.jpg"
                    alt="Elegant event setup at TVS Event Center"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-600 mb-2">1000+</div>
                    <div className="text-sm text-gray-600">Events Hosted</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="By The Numbers"
              title="A Legacy of Success"
              description="Our commitment to excellence is reflected in every milestone we've achieved over the years."
            />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16">
              {[
                { number: '10+', label: 'Years of Excellence', icon: Calendar },
                { number: '1000+', label: 'Events Hosted', icon: Star },
                { number: '500+', label: 'Happy Couples', icon: Heart }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-8 bg-white rounded-2xl shadow-lg"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features & Amenities */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Features & Amenities"
              title="Luxury at Every Turn"
              description="Discover the premium features and world-class amenities that make TVS Event Center the perfect choice for your special occasion."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {companyInfo.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-3 bg-gold-100 rounded-lg flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature}</h3>
                    <p className="text-gray-600">Premium quality services designed to enhance your event experience.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  To create extraordinary experiences that celebrate life's most precious moments. We believe every event should be a masterpiece, crafted with passion, attention to detail, and unwavering commitment to excellence.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center lg:text-left"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Vision</h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  To be the world's most celebrated event venue, where dreams come to life and memories are made. We envision a future where every celebration becomes a story worth telling for generations.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <SectionHeading
              subtitle="Why Choose Us"
              title="The TVS Event Center Difference"
              description="Discover what sets us apart and makes us the preferred choice for discerning clients who demand excellence."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gold-100 rounded-lg flex-shrink-0">
                    <Shield className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Trusted Expertise</h3>
                    <p className="text-gray-600">With over a decade of experience, our team brings unmatched expertise in event planning and execution.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gold-100 rounded-lg flex-shrink-0">
                    <Clock className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
                    <p className="text-gray-600">Our dedicated support team is available round the clock to ensure your event runs smoothly.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gold-100 rounded-lg flex-shrink-0">
                    <Star className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Service</h3>
                    <p className="text-gray-600">Every event is unique, and we tailor our services to match your specific vision and requirements.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/images/Professionalimg.jpg"
                  alt="Professional event team at work"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h4 className="text-2xl font-bold mb-2">Professional Excellence</h4>
                  <p className="text-gray-200">Every detail handled with precision and care</p>
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