'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [updating, setUpdating] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get bookingId from localStorage or URL
    const updateBookingStatus = async () => {
      try {
        let bookingId = null;
        
        // Try URL first
        bookingId = searchParams.get('bookingId');
        
        // Fall back to localStorage
        if (!bookingId && typeof window !== 'undefined') {
          bookingId = localStorage.getItem('bookingId');
        }

        if (!bookingId) {
          console.warn('No bookingId found to update payment status');
          setUpdating(false);
          return;
        }

        // Call the PATCH API to update booking to paid
        const response = await fetch(`/api/admin/bookings/${bookingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentStatus: 'paid' })
        });

        if (response.ok) {
          console.log('Booking payment status updated to paid');
          // Clear localStorage
          try { localStorage.removeItem('bookingId'); } catch (e) {}
        } else {
          const errData = await response.json();
          console.error('Failed to update booking:', errData.error);
          setError('Unable to confirm payment in system. Please contact support.');
        }
      } catch (err) {
        console.error('Error updating booking status:', err);
        setError('An error occurred. Please contact support.');
      } finally {
        setUpdating(false);
      }
    };

    updateBookingStatus();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your payment. Your event booking has been confirmed.
          </p>
        </div>

        <div className="bg-gray-50 rounded p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            A confirmation email has been sent to your registered email address.
          </p>
          {updating && (
            <p className="text-sm text-blue-600 font-medium">
              Confirming your booking...
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 font-medium">
              {error}
            </p>
          )}
          {!updating && !error && (
            <p className="text-sm text-green-600 font-medium">
              ✓ Booking confirmed in system
            </p>
          )}
        </div>

        <Link
          href="/"
          className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
