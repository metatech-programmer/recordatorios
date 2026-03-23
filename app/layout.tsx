import type { Metadata, Viewport } from 'next';
import { Fredoka, Comfortaa } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/Toast';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Lizzard from '@/components/Lizzard';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700'],
});

const comfortaa = Comfortaa({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Recordatorios - Tu compañero de tareas',
  description: 'PWA minimalista de recordatorios con tu lagartija mascota personal. Sincronización offline, notificaciones push, instalable en cualquier dispositivo.',
  metadataBase: new URL('https://recordatorios.vercel.app'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Recordatorios',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: '/icons/apple-touch-icon.svg',
    icon: '/icons/icon-192.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://recordatorios.vercel.app',
    title: 'Recordatorios - Tu compañero de tareas',
    description: 'PWA minimalista de recordatorios con tu lagartija mascota personal',
    images: [
      {
        url: '/icons/icon-512.svg',
        width: 512,
        height: 512,
        alt: 'Recordatorios App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recordatorios - Digital',
    description: 'Tu compañero de tareas con lagartija virtual',
    images: ['/icons/icon-512.svg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#E8D7F1',
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showLizzard = process.env.NODE_ENV === 'production';

  // JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org' as const,
    '@type': 'SoftwareApplication' as const,
    name: 'Recordatorios',
    applicationCategory: 'Productivity',
    description:
      'PWA minimalista de recordatorios con tu lagartija mascota personal',
    url: 'https://recordatorios.vercel.app',
    image: 'https://recordatorios.vercel.app/icons/icon-512.svg',
    author: {
      '@type': 'Organization' as const,
      name: 'Recordatorios',
    },
    offers: {
      '@type': 'Offer' as const,
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html lang="es" className={`${fredoka.variable} ${comfortaa.variable}`} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <link rel="icon" href="/icons/icon-192.svg" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.svg" />
        <link rel="canonical" href="https://recordatorios.vercel.app" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#E8D7F1" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={comfortaa.className} suppressHydrationWarning>
        <ToastProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pb-24 pt-4 max-w-2xl mx-auto w-full px-4">
              {children}
            </main>
            <Navigation />
            {showLizzard ? <Lizzard /> : null}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
