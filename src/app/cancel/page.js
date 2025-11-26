import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Canceled</h1>
          <p className="text-gray-600 mb-4">
            Your payment has been canceled. No charges have been made to your account.
          </p>
        </div>

        <div className="bg-gray-50 rounded p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            You can try again or contact us for assistance.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Return to Home
          </Link>
          <Link
            href="/contact"
            className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
