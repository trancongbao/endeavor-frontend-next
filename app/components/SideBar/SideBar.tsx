import Logo from './Logo/Logo'
import Profile from './Profile/Profile';
import Menu from './Menu/Menu'

export default function SideBar({ authenticatedUser, setAuthenticatedUser }) {
  return (
    <div className="w-64 h-screen bg-white pt-10 flex flex-col justify-between items-center gap-4">
      <Profile
        authenticatedUser={authenticatedUser}
        setAuthenticatedUser={setAuthenticatedUser}
      />
      <Menu />
      <Logo />
    </div>
  )
}
