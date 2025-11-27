"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    date: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Book Now
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Your Perfect Day Awaits.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/3 space-y-4 border-r pr-4">
          <SidebarStep label="Service Selection" active={step === 1} completed={step > 1} />
          <SidebarStep label="Date & Time" active={step === 2} completed={step > 2} />
          <SidebarStep label="Your Information" active={step === 3} completed={false} />

          <div className="mt-6 text-sm text-gray-600">
            <p className="font-semibold">Get in Touch</p>
            <p className="text-blue-600">+1 832 276 1055</p>
            <p>tvseventcenter@gmail.com</p>
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl font-semibold mb-4">Service Selection</h3>
                <select
                  className="border rounded-lg w-full p-3 mb-6"
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                >
                  <option value="">Select Service</option>
                  <option>Weddings</option>
                  <option>Reunions</option>
                  <option>Corporate Events</option>
                  <option>Birthday Parties</option>
                </select>
                <button
                  onClick={nextStep}
                  disabled={!formData.service}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl font-semibold mb-4">Select Date & Time</h3>
                <Calendar
                  onChange={(date) => setFormData({ ...formData, date })}
                  value={formData.date}
                  minDate={new Date()} // disables past days
                  tileDisabled={({ date }) => date < new Date().setHours(0, 0, 0, 0)}
                  tileClassName={({ date }) =>
                    date < new Date().setHours(0, 0, 0, 0)
                      ? "text-red-400 opacity-50"
                      : ""
                  }
                />
                <div className="flex justify-between mt-6">
                  <button
                    onClick={prevStep}
                    className="border px-6 py-2 rounded-md"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!formData.date}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl font-semibold mb-4">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border p-3 rounded-lg"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="border p-3 rounded-lg"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="border p-3 rounded-lg"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="border p-3 rounded-lg"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="border px-6 py-2 rounded-md"
                  >
                    Back
                  </button>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
                    Submit
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SidebarStep({ label, active, completed }) {
  return (
    <div
      className={`flex items-center gap-2 ${
        active ? "text-blue-600 font-semibold" : "text-gray-500"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
          completed
            ? "bg-green-500 border-green-500 text-white"
            : active
            ? "border-blue-600"
            : "border-gray-400"
        }`}
      >
        {completed ? "✓" : active ? "•" : ""}
      </div>
      {label}
    </div>
  );
}
