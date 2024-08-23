import SideBar from '@/app/components/SideBar/SideBar'
import { redirect } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // TODO: redirect('/login')
  return (
    <div className='w-full h-full flex gap-2'>
      <SideBar />
      <div className="w-full h-full bg-white p-3">{children}</div>
    </div>
  )
}
