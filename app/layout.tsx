import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="w-full h-full">
      <body className={`w-full h-full ${inter.className}`}>
        <div className="w-full h-full p-2 bg-primary-500">{children}</div>
      </body>
    </html>
  )
}
