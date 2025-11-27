'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle
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
  fetchOccupiedDates,
  addOccupiedDate,
  removeOccupiedDate
} from '@/lib/calendarUtils'

const AdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [occupiedDates, setOccupiedDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notification, setNotification] = useState({ type: '', message: '' })

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Fetch occupied dates on component mount
  useEffect(() => {
    loadOccupiedDates()
  }, [])

  const loadOccupiedDates = async () => {
    try {
      setLoading(true)
      const dates = await fetchOccupiedDates()
      setOccupiedDates(dates)
    } catch (error) {
      console.error('Failed to load occupied dates:', error)
      if (error.message.includes('Database table not found')) {
        showNotificationMessage('error', 'Database not set up. Please run the SQL script in Supabase first.')
      } else {
        showNotificationMessage('error', `Failed to load dates: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const showNotificationMessage = (type, message) => {
    setNotification({ type, message })
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
    setSelectedDate(null)
  }

  const handleDateClick = (date) => {
    if (!date || isPastDate(date)) return
    setSelectedDate(date)
  }

  const toggleOccupiedSlot = async (date, slot) => {
    if (!date || isPastDate(date)) return

    try {
      const dateString = formatDateToString(date)
      const slots = getOccupiedSlots(date, occupiedDates)
      const currently = slots[slot]

      // If currently true, we want to free the slot; otherwise occupy it
      if (currently) {
        // call API to free slot
        const res = await fetch(`/api/admin/occupied-dates?date=${dateString}&slot=${slot}`, { method: 'DELETE' })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to free slot')
        // update local state
        setOccupiedDates(prev => prev.map(d => d.date === dateString ? { ...d, [slot]: false } : d))
        showNotificationMessage('success', `${slot} marked available`) 
      } else {
        const res = await fetch('/api/admin/occupied-dates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: dateString, slot }) })
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to occupy slot')
        const updated = await res.json()
        // update local state
        setOccupiedDates(prev => {
          const exists = prev.find(d => d.date === dateString)
          if (exists) return prev.map(d => d.date === dateString ? { ...d, [slot]: true } : d)
          return [...prev, { date: dateString, id: updated.data?.id || Date.now().toString(), daytime: slot === 'daytime', evening: slot === 'evening' }]
        })
        showNotificationMessage('success', `${slot} marked occupied`)
      }

      setSelectedDate(null)
    } catch (error) {
      showNotificationMessage('error', error.message)
    }
  }

  const getDateClass = (date) => {
    if (!date) return ''
    
    let classes = 'w-10 h-10 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all duration-200 '
    
    if (isPastDate(date)) {
      classes += 'text-gray-300 cursor-not-allowed '
    } else if (isDateOccupied(date, occupiedDates)) {
      classes += 'bg-red-100 text-red-800 border-2 border-red-300 hover:bg-red-200 '
    } else if (isToday(date)) {
      classes += 'bg-blue-100 text-blue-800 border-2 border-blue-300 hover:bg-blue-200 '
    } else {
      classes += 'bg-green-50 text-green-800 border-2 border-green-200 hover:bg-green-100 '
    }
    
    if (selectedDate && isSameDay(date, selectedDate)) {
      classes += 'ring-2 ring-amber-500 ring-offset-2 '
    }
    
    return classes
  }

  const calendarGrid = generateCalendarGrid(currentYear, currentMonth)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-6 h-6 text-amber-600" />
          <h3 className="text-xl font-bold text-gray-900">Date Management</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600 font-medium">Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-gray-600 font-medium">Occupied</span>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h4 className="text-lg font-semibold text-gray-900">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h4>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAY_NAMES.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarGrid.map((date, index) => (
            <div key={index} className="flex justify-center">
              {date ? (
                <button
                  onClick={() => handleDateClick(date)}
                  disabled={isPastDate(date)}
                  className={getDateClass(date)}
                >
                  {date.getDate()}
                </button>
              ) : (
                <div className="w-10 h-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Date Actions */}
      {selectedDate && !isPastDate(selectedDate) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-4 border-l-4 border-amber-500"
        >
          <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">Slot status:</p>
                  <div className="flex items-center space-x-3 mt-2">
                    {(() => {
                      const slots = getOccupiedSlots(selectedDate, occupiedDates)
                      return (
                        <>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${slots.daytime ? 'bg-red-100 text-red-800' : 'bg-green-50 text-green-800'}`}>Daytime</span>
                            <button onClick={() => toggleOccupiedSlot(selectedDate, 'daytime')} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">{slots.daytime ? 'Free' : 'Occupy'}</button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${slots.evening ? 'bg-red-100 text-red-800' : 'bg-green-50 text-green-800'}`}>Evening</span>
                            <button onClick={() => toggleOccupiedSlot(selectedDate, 'evening')} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">{slots.evening ? 'Free' : 'Occupy'}</button>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Instructions:</p>
            <ul className="text-sm text-blue-800 mt-1 space-y-1 font-medium">
              <li>• Click on any future date to select it</li>
              <li>• Green dates are available for booking</li>
              <li>• Red dates are marked as occupied</li>
              <li>• Use the buttons to mark dates as occupied or available</li>
              <li>• Past dates cannot be modified</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminCalendar