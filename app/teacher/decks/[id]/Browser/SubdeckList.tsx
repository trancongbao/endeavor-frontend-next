import { Row, SubdeckRows } from '../page'

export default function SubdeckList({ subdecks, selectedSubdeck, setSelectedSubdeck }: SubdecksProps) {
  return (
    <div className="basis-80 border-r-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {Object.keys(subdecks).map((subdeckOrder) => {
          return (
            <p
              key={subdeckOrder}
              onClick={() => setSelectedSubdeck(subdecks[subdeckOrder])}
              className={`hover:bg-blue-100 ${selectedSubdeck[0].lessonOrder === parseInt(subdeckOrder) ? 'bg-blue-300' : ''} cursor-pointer p-2 rounded`}
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

// Type for Subdecks props
interface SubdecksProps {
  subdecks: SubdeckRows
  selectedSubdeck: Row[]
  setSelectedSubdeck: React.Dispatch<React.SetStateAction<Row[]>> // State setter function type
}
