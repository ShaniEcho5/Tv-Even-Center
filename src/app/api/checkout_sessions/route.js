import Stripe from 'stripe';
import { companyInfo } from '@/data/companyInfo';
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { bookingId, timeSlot } = body || {}

    // Calculate total: basePrice + cleaning fee (in cents for Stripe)
    const totalAmount = (companyInfo.pricing.basePrice + companyInfo.pricing.cleaning.fee) * 100;

    // try to fetch booking to prefill customer_email
    let customerEmail = undefined
    if (bookingId) {
      try {
        const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
        if (serviceKey) {
          const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey)
          const { data, error } = await adminSupabase.from('bookings').select('*').eq('id', bookingId).limit(1)
          if (!error && data && data.length > 0) customerEmail = data[0].email
        }
      } catch (e) {
        console.warn('Unable to fetch booking for email:', e)
      }
    }

    // Pass bookingId in success URL so success page can update booking status
    const successUrl = bookingId 
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/success?bookingId=${encodeURIComponent(bookingId)}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/success`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Service Payment',
              description: `Event Center Rental (${companyInfo.pricing.basePrice}) + Cleaning Fee (${companyInfo.pricing.cleaning.fee})`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        bookingId: bookingId ? String(bookingId) : '',
        timeSlot: timeSlot ? String(timeSlot) : ''
      },
      customer_email: customerEmail
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
