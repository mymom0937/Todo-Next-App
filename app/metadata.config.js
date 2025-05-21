// This file exports metadata configuration for Next.js
// It's used by the root layout to provide proper metadata

export const metadata = {
  title: 'Todo Next App',
  description: 'A modern Todo application built with Next.js',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/site.webmanifest',
  applicationName: 'Todo Next App',
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Todo App',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Todo Next App',
    description: 'A modern Todo application built with Next.js',
    siteName: 'Todo Next App',
  },
}; 