'use client';

import { useState } from 'react';
import { companyInfo } from '@/data/companyInfo';
import PayButton from '@/components/PayButton';
import Link from 'next/link';

export default function BookingPaymentPage() {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('daytime');

  const basePrice = companyInfo.pricing.basePrice;
  const cleaningFee = companyInfo.pricing.cleaning.fee;
  const total = basePrice + cleaningFee;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Event Booking Payment
          </h1>
          <p className="text-xl text-gray-600">
            Complete your reservation at {companyInfo.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Booking Details */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>

            {/* Venue Info */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Venue</h3>
              <p className="text-gray-600">{companyInfo.name}</p>
              <p className="text-sm text-gray-500">{companyInfo.address.full}</p>
              <p className="text-sm text-gray-500 mt-2">Capacity: {companyInfo.maxCapacity}</p>
              <p className="text-sm text-gray-500">Area: {companyInfo.totalArea}</p>
            </div>

            {/* Time Slot Selection */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time Slot</h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition" >
                  <input
                    type="radio"
                    name="timeSlot"
                    value="daytime"
                    checked={selectedTimeSlot === 'daytime'}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Daytime</p>
                    <p className="text-sm text-gray-600">
                      {companyInfo.pricing.timeSlots.daytime.hours}
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="radio"
                    name="timeSlot"
                    value="evening"
                    checked={selectedTimeSlot === 'evening'}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Evening</p>
                    <p className="text-sm text-gray-600">
                      {companyInfo.pricing.timeSlots.evening.hours}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Included Services</h3>
              <ul className="space-y-2">
                {companyInfo.services.map((service, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Price & Payment */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Summary</h2>

            {/* Price Breakdown */}
            <div className="mb-8 pb-8 border-b border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Venue Rental</span>
                <span className="text-gray-900 font-semibold">${basePrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{companyInfo.pricing.cleaning.description}</span>
                <span className="text-gray-900 font-semibold">${cleaningFee}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">${total}</span>
              </div>
              <p className="text-sm text-gray-500 italic">
                {companyInfo.pricing.taxNote}
              </p>
            </div>

            {/* Contact Info */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Phone:</strong> {companyInfo.contact.phone}</p>
                <p><strong>Email:</strong> {companyInfo.contact.email}</p>
                <p><strong>Contact Person:</strong> {companyInfo.contact.contactPerson}</p>
              </div>
            </div>

            {/* Payment Button */}
            <div className="mb-6">
              <PayButton />
            </div>

            {/* Back Link */}
            <Link
              href="/booking"
              className="block text-center text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              ← Back to Booking
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">How Payment Works</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">1.</span>
              <span>Select your preferred time slot (Daytime or Evening)</span>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">2.</span>
              <span>Review the booking details and price breakdown</span>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">3.</span>
              <span>Click "Proceed to Payment" button</span>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">4.</span>
              <span>You'll be redirected to Stripe Checkout (secure payment)</span>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">5.</span>
              <span>Enter your card details and complete payment</span>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">6.</span>
              <span>After successful payment, you'll see a confirmation page</span>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">7.</span>
              <span>A confirmation email will be sent to your email address</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
