import './globals.css'
import { getBaseUrl } from '@/lib/seo-utils'
import { getFaviconConfig } from '@/lib/favicon-utils'
import DynamicSEO from '@/components/DynamicSEO'

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
  metadataBase: new URL(getBaseUrl()),
  // Remove static canonical - will be handled dynamically
  // alternates: {
  //   canonical: 'https://tv-even-center.vercel.app',
  // },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    // URL will be handled dynamically per page
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
  icons: getFaviconConfig(),
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#d97b15" />
        <meta name="msapplication-TileColor" content="#d97b15" />
      </head>
      <body className="font-body antialiased">
        <DynamicSEO />
        {children}
      </body>
    </html>
  )
}