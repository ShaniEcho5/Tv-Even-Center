import { submitBooking } from '@/lib/supabase'
import { sendAdminNotification, sendCustomerConfirmation } from '@/lib/emailUtils'

export async function POST(request) {
  try {
    const formData = await request.json()

    // Basic validation - use camelCase keys matching bookings table
    if (!formData.name || !formData.email || !formData.eventDate) {
      return Response.json({ error: 'Name, email and eventDate are required' }, { status: 400 })
    }

    const result = await submitBooking(formData)
    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 })
    }

    // Send email notifications asynchronously
    try {
      await sendAdminNotification(formData)
      await sendCustomerConfirmation(formData)
    } catch (e) {
      console.error('Email send error (bookings):', e)
    }

    // Return booking id
    return Response.json({ message: 'Booking created', bookingId: result.data[0]?.id, data: result.data }, { status: 200 })
  } catch (error) {
    console.error('API Error (bookings):', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
