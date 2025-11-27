import Stripe from 'stripe'
import { updateBookingPayment } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request) {
  const sig = request.headers.get('stripe-signature')

  let event
  try {
    const body = await request.text()
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const bookingId = session.metadata?.bookingId || null
    const timeSlot = session.metadata?.timeSlot || null

    try {
      if (bookingId) {
        const updates = {
          paymentStatus: 'paid',
          paymentDetails: {
            payment_intent: session.payment_intent,
            amount_total: session.amount_total,
            currency: session.currency,
            customer_email: session.customer_email || session.customer_details?.email || null
          },
          timeSlot: timeSlot || undefined,
          stripeSessionId: session.id || undefined
        }

        const result = await updateBookingPayment(bookingId, updates)
        if (!result.success) {
          console.error('Failed to update booking payment:', result.error)
        }
      } else {
        console.warn('No bookingId in session metadata; cannot update booking')
      }
    } catch (e) {
      console.error('Error processing webhook booking update:', e)
    }
  }

  return new Response('Received', { status: 200 })
}
