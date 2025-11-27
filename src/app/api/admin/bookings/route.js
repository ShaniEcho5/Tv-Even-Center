import { getBookings } from '@/lib/supabase'

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams)
    const result = await getBookings(params)
    if (!result.success) return Response.json({ error: result.error }, { status: 500 })
    return Response.json(result.data)
  } catch (error) {
    console.error('Admin bookings fetch error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
