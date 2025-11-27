'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  AlertTriangle,
  Info
} from 'lucide-react'
import {
  generateCalendarGrid,
  MONTH_NAMES,
  DAY_NAMES,
  formatDateToString,
  isPastDate,
  isToday,
  isSameDay,
  isDateOccupied,
  isDateFullyOccupied,
  getOccupiedSlots,
  fetchOccupiedDates
} from '@/lib/calendarUtils'

const BookingCalendar = ({ selectedDate, onDateSelect, className = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [occupiedDates, setOccupiedDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Fetch occupied dates on component mount
  useEffect(() => {
    loadOccupiedDates()
  }, [])

  const loadOccupiedDates = async () => {
    try {
      setLoading(true)
      setError(null)
      const dates = await fetchOccupiedDates()
      setOccupiedDates(dates)
    } catch (error) {
      console.error('Failed to load occupied dates:', error)
      setError('Unable to load availability. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const handleDateClick = (date) => {
    if (!date || isPastDate(date) || isDateFullyOccupied(date, occupiedDates)) {
      return // Prevent selection of past or fully occupied dates
    }
    
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  const getDateClass = (date) => {
    if (!date) return ''
    
    let classes = 'w-8 h-8 flex items-center justify-center text-xs rounded-lg transition-all duration-200 font-semibold '
    const slots = getOccupiedSlots(date, occupiedDates)
    
    if (isPastDate(date)) {
      classes += 'text-gray-300 cursor-not-allowed '
    } else if (slots.daytime && slots.evening) {
      classes += 'bg-red-100 text-red-700 cursor-not-allowed border border-red-300 relative '
    } else if (slots.daytime || slots.evening) {
      // Partially occupied (one slot) - show amber highlight so users see limited availability
      classes += 'bg-amber-50 text-amber-800 border border-amber-300 relative '
    } else {
      classes += 'bg-white text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-300 cursor-pointer '
      
      if (isToday(date)) {
        classes += 'border-blue-400 bg-blue-50 text-blue-700 '
      }
    }
    
    if (selectedDate && isSameDay(date, selectedDate)) {
      classes += 'ring-2 ring-amber-500 ring-offset-1 bg-amber-50 border-amber-300 text-amber-800 '
    }
    
    return classes
  }

  const calendarGrid = generateCalendarGrid(currentYear, currentMonth)

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center p-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">{error}</p>
          <button 
            onClick={loadOccupiedDates}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <CalendarIcon className="w-5 h-5 text-amber-600" />
        <h3 className="text-base font-bold text-gray-900">Select Event Date</h3>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        
        <h4 className="text-base font-semibold text-gray-900">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h4>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarGrid.map((date, index) => (
            <div key={index} className="flex justify-center">
              {date ? (
                <button
                  onClick={() => handleDateClick(date)}
                  disabled={isPastDate(date) || isDateOccupied(date, occupiedDates)}
                  className={getDateClass(date)}
                  title={
                    isPastDate(date) 
                      ? 'Past date' 
                      : isDateOccupied(date, occupiedDates) 
                      ? 'Date not available - Already booked' 
                      : 'Click to select this date'
                  }
                >
                  <span className="relative">
                    {date.getDate()}
                    { (slots.daytime && slots.evening) ? (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full text-[6px] flex items-center justify-center text-white font-bold">×</span>
                    ) : (
                      // show per-slot indicators when partially occupied
                      (() => {
                        // `slots` already defined above
                        if (slots.daytime || slots.evening) {
                          return (
                            <span className="absolute -top-1 -right-1 flex space-x-0.5">
                              <span className={`w-2 h-2 ${slots.daytime ? 'bg-red-500' : 'bg-gray-300'} rounded-full`} />
                              <span className={`w-2 h-2 ${slots.evening ? 'bg-red-500' : 'bg-gray-300'} rounded-full`} />
                            </span>
                          )
                        }
                        return null
                      })()
                    )}
                  </span>
                </button>
              ) : (
                <div className="w-8 h-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-500 mb-3"
        >
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Selected:</p>
              <p className="text-amber-800 font-semibold text-sm">
                {selectedDate.toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-white border border-gray-200 rounded"></div>
          <span className="text-gray-600 font-medium">Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-gray-600 font-medium">Occupied</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-50 border border-blue-400 rounded"></div>
          <span className="text-gray-600 font-medium">Today</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-amber-50 border border-amber-300 rounded ring-1 ring-amber-500"></div>
          <span className="text-gray-600 font-medium">Selected</span>
        </div>
      </div>

      {/* Info Message */}
      <div className="mt-3 bg-blue-50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-900">Booking Info:</p>
            <p className="text-xs text-blue-800 mt-1 font-medium">
              Red dates are occupied and cannot be selected. Choose any available date.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingCalendar