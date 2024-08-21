import './SideBar.scss'
import Logo from './Logo/Logo'
import Profile from './Profile/Profile';
import Menu from './Menu/Menu'

export default function SideBar({ authenticatedUser, setAuthenticatedUser }) {
  return (
    <div className="flex flex-col justify-between items-center gap-4 side-bar active">
      <Profile
        authenticatedUser={authenticatedUser}
        setAuthenticatedUser={setAuthenticatedUser}
      />
      <Menu />
      <Logo />
    </div>
  )
}
