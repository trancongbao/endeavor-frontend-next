export default function Subdecks({ subdecks, currentSubdeck, setCurrentSubdeck }) {
  return (
    <div className="basis-80 border-r-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {Object.entries(subdecks).map(([subdeckOrder, rows]) => {
          return (
            <p
              key={subdeckOrder}
              onClick={() => setCurrentSubdeck(subdeckOrder)}
              className="hover:bg-blue-200"
            >{`${subdecks[subdeckOrder][0].lessonTitle}`}</p>
          )
        })}
      </div>
      <button className="w-36 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Sub-deck
      </button>
    </div>
  )
}
