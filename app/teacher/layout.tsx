import SideBar from '@/app/components/SideBar/SideBar'
import { redirect } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // TODO: redirect('/login')
  return (
    <div>
      <SideBar />
      <div className="p-3 flex-1 bg-green-200">
        <div className="w-full h-full bg-white p-3">{children}</div>
      </div>
    </div>
  )
}
