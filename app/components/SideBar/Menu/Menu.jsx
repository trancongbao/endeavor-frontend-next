import { Book, Layers, Phone } from 'react-feather'
import Link from 'next/link'

const items = [
  { text: 'My Courses', icon: Book, href: '/decks' },
  { text: 'My Decks', icon: Layers, href: '/decks' },
  { text: 'Contact Us', icon: Phone, href: '/decks' },
]

export default function Menu() {
  return (
    <nav className="self-start p-10 flex flex-col gap-7 text-[18px]">
      {items.map((item, index) => (
        <Link href={item.href} key={index} className="flex gap-3 items-center">
          <item.icon color="hsl(180, 70%, 50%)" />
          {item.text}
        </Link>
      ))}
    </nav>
  )
}
