import { updateBookingPayment } from '@/lib/supabase'

export async function PATCH(request, { params }) {
  try {
    const url = new URL(request.url)
    const body = await request.json().catch(() => ({}))
    const { paymentStatus, timeSlot } = body

    // Resolve bookingId from multiple possible locations for robustness
    let bookingId = params?.bookingId || body?.bookingId || url.searchParams.get('bookingId')
    if (!bookingId) {
      // Attempt to extract last path segment as fallback
      const parts = url.pathname.split('/').filter(Boolean)
      bookingId = parts[parts.length - 1]
    }

    console.log('PATCH /api/admin/bookings [debug]:', { url: request.url, params, bookingId, paymentStatus, timeSlot })

    if (!bookingId) {
      return Response.json({ error: 'bookingId required' }, { status: 400 })
    }

    const updates = {}
    if (paymentStatus) updates.paymentStatus = paymentStatus
    if (timeSlot) updates.timeSlot = timeSlot

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: 'No updates provided' }, { status: 400 })
    }

    const result = await updateBookingPayment(bookingId, updates)

    if (!result.success) {
      console.error('Failed to update booking:', { bookingId, error: result.error })
      return Response.json({ error: result.error }, { status: 500 })
    }

    console.log('Booking updated successfully:', { bookingId })
    return Response.json({ success: true, data: result.data })
  } catch (error) {
    console.error('API Error in PATCH bookings:', error)
    return Response.json({ error: 'Internal server error: ' + (error?.message || String(error)) }, { status: 500 })
  }
}

