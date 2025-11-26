import Stripe from 'stripe';
import { companyInfo } from '@/data/companyInfo';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Calculate total: basePrice + cleaning fee (in cents for Stripe)
    const totalAmount = (companyInfo.pricing.basePrice + companyInfo.pricing.cleaning.fee) * 100;

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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
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
