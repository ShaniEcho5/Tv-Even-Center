// Utility functions for calendar date management

// Format date to YYYY-MM-DD string (timezone-safe)
export const formatDateToString = (date) => {
  if (!date) return ''
  const d = new Date(date)
  // Use local timezone to avoid date shifting
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Parse date string to Date object
export const parseStringToDate = (dateString) => {
  if (!dateString) return null
  return new Date(dateString + 'T00:00:00')
}

// Check if two dates are the same day
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false
  return formatDateToString(date1) === formatDateToString(date2)
}

// Check if date is in the past
export const isPastDate = (date) => {
  if (!date) return false
  const today = new Date()
  const checkDate = new Date(date)
  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate < today
}

// Check if date is today
export const isToday = (date) => {
  if (!date) return false
  const today = new Date()
  const checkDate = new Date(date)
  return isSameDay(today, checkDate)
}

// Get days in month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

// Get first day of month (0 = Sunday, 1 = Monday, etc.)
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay()
}

// Generate calendar grid for a month
export const generateCalendarGrid = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const grid = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    grid.push(null)
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    grid.push(new Date(year, month, day))
  }
  
  return grid
}

// Month names
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Day names
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// API functions for occupied dates
export const fetchOccupiedDates = async () => {
  try {
    const response = await fetch('/api/admin/occupied-dates')
    
    if (!response.ok) {
      // Get error details from response
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 404 && errorData.setupRequired) {
        throw new Error('Database table not found. Please run the SQL setup script in Supabase first.')
      }
      
      throw new Error(errorData.details || errorData.error || `HTTP ${response.status}: Failed to fetch occupied dates`)
    }
    
    const data = await response.json()
    // Expect records with { date: 'YYYY-MM-DD', daytime: boolean, evening: boolean }
    return data.dates || []
  } catch (error) {
    console.error('Error fetching occupied dates:', error)
    throw error // Re-throw to let components handle the error
  }
}

export const addOccupiedDate = async (date) => {
  try {
    const response = await fetch('/api/admin/occupied-dates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: formatDateToString(date) }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add occupied date')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error adding occupied date:', error)
    throw error
  }
}

export const removeOccupiedDate = async (date) => {
  try {
    const response = await fetch(`/api/admin/occupied-dates?date=${formatDateToString(date)}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to remove occupied date')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error removing occupied date:', error)
    throw error
  }
}

// Check if date is occupied
export const isDateFullyOccupied = (date, occupiedDates) => {
  if (!date || !occupiedDates) return false
  const dateString = formatDateToString(date)
  const rec = occupiedDates.find(d => d.date === dateString)
  if (!rec) return false
  // fully occupied if both slots true
  return !!rec.daytime && !!rec.evening
}

export const getOccupiedSlots = (date, occupiedDates) => {
  if (!date || !occupiedDates) return { daytime: false, evening: false }
  const dateString = formatDateToString(date)
  const rec = occupiedDates.find(d => d.date === dateString)
  if (!rec) return { daytime: false, evening: false }
  return { daytime: !!rec.daytime, evening: !!rec.evening }
}

export const isDateOccupied = (date, occupiedDates, slot = null) => {
  // If slot specified, check that slot; otherwise if any slot occupied return true
  if (!date || !occupiedDates) return false
  const slots = getOccupiedSlots(date, occupiedDates)
  if (slot === 'daytime') return slots.daytime
  if (slot === 'evening') return slots.evening
  return slots.daytime && slots.evening
}