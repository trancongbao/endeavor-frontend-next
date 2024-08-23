import Logo from './Logo/Logo'
import Profile from './Profile/Profile'
import Menu from './Menu/Menu'

export default function SideBar() {
  return (
    <div className="w-64 h-full bg-white pt-10 flex flex-col justify-between items-center gap-4">
      <Profile />
      <Menu />
      <Logo />
    </div>
  )
}
