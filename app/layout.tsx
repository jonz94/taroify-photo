import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: '芋化大頭貼',
  description: '讓你的大頭貼變成芋頭紫',
  openGraph: {
    type: 'website',
    title: '芋化大頭貼',
    description: '讓你的大頭貼變成芋頭紫',
    siteName: '芋化大頭貼',
  },
  twitter: {
    card: 'summary',
    title: '芋化大頭貼',
    description: '讓你的大頭貼變成芋頭紫',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}

          <Toaster richColors expand closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
