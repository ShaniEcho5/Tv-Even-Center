import Link from 'next/link';

export default function SuccessPage() {
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
