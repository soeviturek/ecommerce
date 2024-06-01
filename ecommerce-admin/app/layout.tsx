import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'


import { ModalProvider } from '@/providers/modal-provider'

import './globals.css'
import prismadb from '@/lib/prismadb'
import { ToasterProvider } from '@/hooks/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const store = prismadb.store;
  
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider  attribute="class"
            defaultTheme="system"
            enableSystem>
            <ToasterProvider/>
            {/* all of the modal lies inside the provider */}
            <ModalProvider/>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
