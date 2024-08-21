import './Profile.scss'
import Image from 'next/image'

// import { rpc } from '../../../rpc/rpc';

export default function Profile({ authenticatedUser, setAuthenticatedUser }) {
  return (
    <div className="profile active flex flex-col items-center gap-3">
      <Image className="short-avatar" src="/sidebar/avatar.webp" alt="" width={100} height={100} />
      {/* <h3>{authenticatedUser.username}</h3> */}
      <h3>Tran Cong Bao</h3>
      {/* <div>{authenticatedUser.userType.toUpperCase()}</div> */}
      <p className="text-2xl">ADMIN</p>
      {authenticatedUser?.level && <div>Level: ${authenticatedUser.level}</div>}

      <div className="flex items-center gap-4">
        <button
          className="w-52 h-16 rounded-lg bg-orange-300 flex justify-center items-center text-white text-2xl"
          onClick={profile}
        >
          Profile
        </button>
        <button
          className="w-52 h-16 rounded-lg bg-orange-300 flex justify-center items-center text-white text-2xl"
          onClick={logout}
        >
          Logout
        </button>
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
