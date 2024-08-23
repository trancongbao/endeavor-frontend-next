import { redirect } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  redirect('/teacher/decks')
}
