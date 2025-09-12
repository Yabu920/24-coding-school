// app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import ClientLayout from './client-layout'
import {Providers} from './provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '24 Coding School - Learn Programming from Scratch to Professional',
  description: 'Professional coding education for kids, high school, and university students. Learn Scratch, C++, Python, and Web Development.',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
          
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
