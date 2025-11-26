# Payment Integration Guide

## How to Access the Payment Page

### URL
```
http://localhost:3000/booking/payment
```

---

## How Payment Works (Step by Step)

### 1. **User Visits Payment Page**
   - URL: `/booking/payment`
   - User selects time slot (Daytime or Evening)
   - Sees booking details and price breakdown
   - Sees total: $649 (rental) + $100 (cleaning) = **$749**

### 2. **User Clicks "Proceed to Payment"**
   - PayButton component is triggered
   - Makes POST request to `/api/checkout_sessions`

### 3. **Server Creates Stripe Checkout Session**
   - `app/api/checkout_sessions/route.js` receives the request
   - Creates a Stripe Checkout Session with:
     - **Line Item:** "Service Payment"
     - **Amount:** $749 (in cents: 74,900)
     - **Currency:** USD
   - Sets URLs for after payment:
     - Success: `http://localhost:3000/success`
     - Cancel: `http://localhost:3000/cancel`
   - Returns checkout URL to client

### 4. **User Redirected to Stripe Checkout**
   - PayButton receives the URL
   - `window.location.href = data.url` redirects to Stripe
   - User enters card details on Stripe's secure form

### 5. **After Payment**
   
   **If Payment Succeeds:**
   - Stripe redirects to `/success` page
   - Shows success message with checkmark
   - User can return to home

   **If Payment Canceled:**
   - Stripe redirects to `/cancel` page
   - Shows cancellation message
   - User can try again or contact support

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── checkout_sessions/
│   │       └── route.js          ← Server API (creates Stripe session)
│   ├── booking/
│   │   └── payment/
│   │       └── page.js            ← Payment page (THIS NEW PAGE)
│   ├── success/
│   │   └── page.js                ← Success page
│   └── cancel/
│       └── page.js                ← Cancel page
└── components/
    └── PayButton.jsx              ← Button component (triggers payment)
```

---

## Environment Variables Required

Make sure your `.env.local` has:
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## How to Add Payment Link to Other Pages

### Option 1: Link from Booking Page
In your booking page, add:
```jsx
import Link from 'next/link';

<Link href="/booking/payment" className="btn-primary">
  Proceed to Payment
</Link>
```

### Option 2: Link from Navigation/Menu
In your Navbar or menu, add:
```jsx
<Link href="/booking/payment">Book & Pay Now</Link>
```

### Option 3: Embed PayButton Component
In any page, import and use:
```jsx
import PayButton from '@/components/PayButton';

export default function SomePage() {
  return (
    <div>
      <h1>Make Payment</h1>
      <PayButton />
    </div>
  );
}
```

---

## Testing Payment

### Test Card Numbers (Stripe Test Mode)
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure Required:** `4000 0025 0000 3155`

Use any future expiry date and any CVC.

---

## Flow Diagram

```
User on /booking/payment
         ↓
   Clicks "Proceed to Payment"
         ↓
   PayButton calls POST /api/checkout_sessions
         ↓
   Server (route.js) creates Stripe session
         ↓
   Server returns checkout URL
         ↓
   Browser redirects to Stripe Checkout
         ↓
   User enters card details
         ↓
         ├─ Payment Success → /success page
         └─ Payment Canceled → /cancel page
```
