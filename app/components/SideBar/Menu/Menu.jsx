// import { NavLink } from 'react-router-dom';
import { Book, Layers, Phone } from 'react-feather'

const Menu = () => {
  return (
    <nav className="self-start p-10 flex flex-col gap-7 text-[18px]">
      <a href="/decks" className="flex gap-3 items-center">
        <Book color="hsl(180, 90%, 50%)" />
        My Courses
      </a>
      <a href="/decks" className="flex gap-3 items-center">
        <Layers color="hsl(180, 90%, 50%)" />
        My Decks
      </a>
      <a href="/decks" className="flex gap-3 items-center">
        <Phone color="hsl(180, 90%, 50%)" />
        Contact us
      </a>
    </nav>
  )
}
export default Menu
