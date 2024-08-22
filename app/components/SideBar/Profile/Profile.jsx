import Image from 'next/image'

// import { rpc } from '../../../rpc/rpc';

export default function Profile({ authenticatedUser, setAuthenticatedUser }) {
  const buttonClass = 'w-40 h-16 rounded-lg bg-orange-300 flex justify-center items-center text-white text-[18px]'

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <Image
        className="rounded-full border border-zinc-950"
        src="/sidebar/avatar.webp"
        alt=""
        width={100}
        height={100}
      />
      {/* <h3>{authenticatedUser.username}</h3> */}
      <p className="text-3xl">Tran Cong Bao</p>
      {/* <div>{authenticatedUser.userType.toUpperCase()}</div> */}
      <p className="text-2xl">TEACHER</p>
      {authenticatedUser?.level && <div>Level: ${authenticatedUser.level}</div>}

      <div className="self-stretch flex items-center justify-evenly">
        <button className={buttonClass} onClick={profile}>
          Profile
        </button>
        <button className={buttonClass} onClick={logout}>
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
