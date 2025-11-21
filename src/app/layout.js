import './globals.css'

export const metadata = {
  title: {
    default: 'TVS Event Center - Celebrate Life\'s Best Moments',
    template: '%s | TVS Event Center'
  },
  description: 'TVS Event Center is a luxurious event venue perfect for weddings, corporate events, birthdays, and celebrations. Located in Rosharon, TX with state-of-the-art facilities.',
  keywords: ['event venue', 'wedding hall', 'corporate events', 'birthday parties', 'luxury venue', 'event center', 'Rosharon TX', 'catering', 'DJ services'],
  authors: [{ name: 'TVS Event Center' }],
  creator: 'TVS Event Center',
  publisher: 'TVS Event Center',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tvseventcenter.com',
    title: 'TVS Event Center - Celebrate Life\'s Best Moments',
    description: 'TVS Event Center is a luxurious event venue perfect for weddings, corporate events, birthdays, and celebrations. Located in Rosharon, TX. ',
    siteName: 'TVS Event Center',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TVS Event Center - Celebrate Life\'s Best Moments',
    description: 'TVS Event Center is a luxurious event venue perfect for weddings, corporate events, birthdays, and celebrations. Located in Rosharon, TX. ',
    creator: '@tvseventcenter',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}