import Image from 'next/image'

export default function Profile() {
  const buttonClass = 'w-28 h-12 rounded-lg bg-orange-300 flex justify-center items-center text-white text-lg'

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Image
        className="rounded-full border border-zinc-950"
        src="/sidebar/avatar.webp"
        alt=""
        width={100}
        height={100}
      />
      {/* <h3>{authenticatedUser.username}</h3> */}
      <p className="text-xl">Tran Cong Bao</p>
      {/* <div>{authenticatedUser.userType.toUpperCase()}</div> */}
      <p className="text-lg">TEACHER</p>
      {/* {authenticatedUser?.level && <div>Level: ${authenticatedUser.level}</div>} */}

      <div className="self-stretch flex items-center justify-evenly">
        <button className={buttonClass}>
          Profile
        </button>
        <button className={buttonClass}>
          Logout
        </button>
      </div>
    </div>
  )
}
