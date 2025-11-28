'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // ✅ FIXED
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingCalendar from '@/components/BookingCalendar'
import SEOHead from '@/components/SEOHead'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, Clock, Users, DollarSign, CheckCircle } from 'lucide-react'
import { companyInfo } from '@/data/companyInfo'

export default function BookingPage() {
  const router = useRouter() // ✅ App Router router
  
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    timeSlot: 'daytime',
    message: ''
  })

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDate) {
      alert('Please select an event date')
      return
    }

    const submissionData = {
      ...formData,
      // match Supabase bookings table column names (camelCase)
      eventDate: selectedDate.toISOString(),
      // include amount so NOT NULL constraint is satisfied (base price + cleaning fee)
      amount: (companyInfo.pricing.basePrice + companyInfo.pricing.cleaning.fee) || companyInfo.pricing.basePrice,
      // booking table has default createdAt, no need to send createdAt explicitly
      paymentStatus: 'pending'
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })

      if (response.ok) {
        const data = await response.json()
        const bookingId = data.submissionId || data.bookingId || data.id
        // store booking id for payment flow
        if (bookingId) {
          try { localStorage.setItem('bookingId', String(bookingId)) } catch (e) { console.warn(e) }
        }
        // store selected timeSlot as well so payment page can read it
        try { localStorage.setItem('selectedTimeSlot', submissionData.timeSlot || formData.timeSlot || 'daytime') } catch(e) { console.warn(e) }

        alert('Booking request submitted successfully!')
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          guestCount: '',
          message: ''
        })
        setSelectedDate(null)

        router.push('/booking/payment') // ✅ Proper redirect
      } else {
        alert('Failed to submit booking request. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <>
      <SEOHead 
        title="Book Your Event"
        description="Book your event at TVS Event Center. Check availability, view pricing, and reserve your date for weddings, corporate events, and celebrations in Rosharon, TX."
        canonical="/booking"
        keywords="book event venue, event booking, venue reservation"
      />

      <Navbar />

      <main>

        {/* HERO */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Book Your Event"
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
                Book Your Event
              </p>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Reserve Your Perfect Date
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                Select your preferred event date and submit your booking request. Our team will contact you within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FORM SECTION */}
        <section className="section-padding bg-gray-50">
          <div className="container-padding">
            <div className="max-w-6xl mx-auto">

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                  Book Your Event
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Choose your event date and provide us with your details.
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-8">

                {/* Calendar */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <BookingCalendar 
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                  />
                </motion.div>

                {/* Form */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >

                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Users className="w-6 h-6 text-amber-600 mr-3" />
                    Event Details
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Event Type *
                        </label>
                        <select
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        >
                          <option value="">Select event type</option>
                          <option value="Wedding">Wedding</option>
                          <option value="Corporate Event">Corporate Event</option>
                          <option value="Birthday Party">Birthday Party</option>
                          <option value="Reunion">Reunion</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Guest Count
                        </label>
                        <input
                          type="number"
                          name="guestCount"
                          value={formData.guestCount}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      {/* Budget Range removed - fixed range handled server-side */}
                    </div>

                    {/* Time Slot Selection (moved to booking step) */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time Slot *</label>
                      <div className="flex gap-4">
                        <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.timeSlot === 'daytime' ? 'border-amber-500 bg-amber-50' : 'border-gray-300'}`}>
                          <input type="radio" name="timeSlot" value="daytime" checked={formData.timeSlot === 'daytime'} onChange={handleInputChange} className="mr-2" />
                          <div>
                            <div className="font-semibold">Daytime</div>
                            <div className="text-sm text-gray-600">{companyInfo.pricing.timeSlots.daytime.hours}</div>
                          </div>
                        </label>
                        <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.timeSlot === 'evening' ? 'border-amber-500 bg-amber-50' : 'border-gray-300'}`}>
                          <input type="radio" name="timeSlot" value="evening" checked={formData.timeSlot === 'evening'} onChange={handleInputChange} className="mr-2" />
                          <div>
                            <div className="font-semibold">Evening</div>
                            <div className="text-sm text-gray-600">{companyInfo.pricing.timeSlots.evening.hours}</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Additional Details
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {selectedDate && (
                      <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-amber-600 mr-2" />
                          <p className="font-semibold text-gray-900">
                            Selected Date: {selectedDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!selectedDate}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-white ${
                        selectedDate
                          ? 'bg-amber-500 hover:bg-amber-600'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {selectedDate ? 'Submit Booking Request' : 'Please Select a Date'}
                    </button>
                  </form>

                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="section-padding bg-white">
          <div className="container-padding">
            <div className="max-w-4xl mx-auto text-center">

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  <DollarSign className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                  Transparent Pricing
                </h3>
                <div className="bg-amber-50 rounded-xl p-8 border border-amber-200">
                  <p className="text-3xl font-bold text-amber-800 mb-2">
                    Starting at $649 + tax
                  </p>
                  <p className="text-gray-700 font-medium">
                    Includes venue rental, tables, chairs, basic lighting, and sound.
                  </p>
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
