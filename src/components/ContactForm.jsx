'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Phone, Mail, MapPin, Clock, CheckCircle, Calendar } from 'lucide-react'
import BookingCalendar from './BookingCalendar'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    budgetRange: '',
    message: ''
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [showBookingDetails, setShowBookingDetails] = useState(false)

  const eventTypes = [
    'Wedding',
    'Corporate Event',
    'Birthday Party',
    'Engagement',
    'Reunion',
    'Conference',
    'Product Launch',
    'Other'
  ]

  const budgetRanges = [
    'Under $5,000',
    '$5,000 - $10,000',
    '$10,000 - $20,000',
    '$20,000 - $50,000',
    '$50,000 - $100,000',
    'Over $100,000',
    'Prefer not to say'
  ]

  const today = new Date().toISOString().split('T')[0]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    // Format date in local timezone to avoid timezone shift issues
    const dateString = date ? 
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` 
      : ''
    setFormData(prev => ({
      ...prev,
      eventDate: dateString
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to submit form')

      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          guestCount: '',
          budgetRange: '',
          message: ''
        })
        setSelectedDate(null)
      }, 3000)
    } catch (error) {
      console.error(error)
      setError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
          Thank You!
        </h3>
        <p className="text-gray-600 mb-6">
          Your inquiry has been submitted successfully. Our team will contact you within 24 hours.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Contact Info (Left side) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-1 space-y-6"
      >
        <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Get In Touch</h3>
        <p className="text-gray-600">
          Ready to plan your perfect event? Contact us today and let our expert team help you.
        </p>

        <div className="space-y-4">
          {[
            { icon: Phone, label: 'Phone', value: '832-228-1066' },
            { icon: Mail, label: 'Email', value: 'tvseventcenter@gmail.com' },
            { icon: MapPin, label: 'Address', value: '15511 Hwy 6 Suite A, Rosharon, TX 77583' },
            { icon: Clock, label: 'Business Hours', value: 'Mon–Fri 9AM–8PM, Sat 9AM–10PM, Sun 10AM–6PM' }
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start space-x-4">
              <div className="p-3 bg-gold-100 rounded-lg">
                <Icon className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{label}</h4>
                <p className="text-gray-600 text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Form (Right side) */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-2"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">Send Us a Message</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Collapsible Booking Details */}
            <div className="border-t pt-4">
              <button
                type="button"
                onClick={() => setShowBookingDetails(!showBookingDetails)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-800 focus:outline-none"
              >
                <span className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gold-600" />
                  Booking Details
                </span>
                <motion.span
                  animate={{ rotate: showBookingDetails ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-500"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {showBookingDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4 space-y-6"
                  >
                    {/* Calendar Section - Full Width */}
                    <div className="mb-6">
                      <BookingCalendar 
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        className="mb-4"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Guest Count
                        </label>
                        <input
                          type="number"
                          name="guestCount"
                          value={formData.guestCount}
                          onChange={handleInputChange}
                          min="1"
                          placeholder="e.g. 100"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-vertical"
                placeholder="Tell us more about your event..."
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center px-8 py-4 rounded-lg font-medium text-white ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Sending...
                </div>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default ContactForm
