import { updateBookingPayment } from '@/lib/supabase'

export async function PATCH(request, { params }) {
  try {
    const { bookingId } = params
    const body = await request.json()
    const { paymentStatus, timeSlot } = body

    if (!bookingId) {
      return Response.json({ error: 'bookingId required' }, { status: 400 })
    }

    const updates = {}
    if (paymentStatus) updates.paymentStatus = paymentStatus
    if (timeSlot) updates.timeSlot = timeSlot

    const result = await updateBookingPayment(bookingId, updates)
    
    if (!result.success) {
      console.error('Error updating booking:', result.error)
      return Response.json({ error: result.error }, { status: 500 })
    }

    return Response.json({ success: true, data: result.data })
  } catch (error) {
    console.error('API Error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
