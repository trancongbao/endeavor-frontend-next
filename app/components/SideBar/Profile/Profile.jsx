import './Profile.scss'
import Image from 'next/image'

// import { rpc } from '../../../rpc/rpc';

export default function Profile({ authenticatedUser, setAuthenticatedUser }) {
  return (
    <div className="profile active flex flex-col items-center">
      <Image className="short-avatar" src="/sidebar/avatar.webp" alt="" width={100} height={100} />
      <h3>authenticatedUser.username</h3>
      <div>authenticatedUser.userType.toUpperCase()</div>
      {authenticatedUser?.level && <div>Level: ${authenticatedUser.level}</div>}

      <div className="flex-btn">
        <div className="option-btn" onClick={profile}>
          Profile
        </div>
        <div className="option-btn" onClick={logout}>
          Logout
        </div>
      </div>
    </div>
  )

  function logout() {
    // rpc('auth', 'logout', {}).then((result) => {
    //   if (result) {
    //     setAuthenticatedUser({});
    //   } else {
    //     alert('Logout error.');
    //   }
    // });
  }

  function profile() {
    //TODO
  }
}
