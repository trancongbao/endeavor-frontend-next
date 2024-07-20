import './SideBar.scss';
import Logo from './Logo/Logo';
// import Profile from './Profile/Profile';
import Menu from './Menu/Menu';

export default function SideBar({ }) {
  return (
    <div className="side-bar active">
      <Logo />
      {/* <Profile
        authenticatedUser={authenticatedUser}
        setAuthenticatedUser={setAuthenticatedUser}
      /> */}
      <Menu />
    </div>
  );
}
