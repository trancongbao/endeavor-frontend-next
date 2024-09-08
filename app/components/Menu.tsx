'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Book, Layers, Phone } from 'react-feather'

export default function Menu() {
  const pathname = usePathname()
  console.log(pathname)

  const items = [
    { text: 'My Courses', icon: Book, href: '/teacher/courses' },
    { text: 'My Decks', icon: Layers, href: '/teacher/decks' },
    { text: 'Contact Us', icon: Phone, href: '/teacher/contact' },
  ]
  return (
    <nav className="p-10 flex flex-col gap-4 text-lg">
      {items.map((item, index) => (
        <Link href={item.href} key={index} className={`flex gap-3 items-center `}>
          <item.icon color="hsl(180, 70%, 50%)" />
          <p className={`${pathname === item.href ? 'text-primary-600' : ''}`}>{item.text}</p>
        </Link>
      ))}
    </nav>
  )
}
