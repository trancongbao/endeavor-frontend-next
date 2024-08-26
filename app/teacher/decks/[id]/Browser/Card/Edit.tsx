import { Row } from '../../page'
import Image from 'next/image'

export default function Edit({ card }: { card: Row[] }) {
  console.log('card: ', card)
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <input className="w-3/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg" value={card[0].cardText} />
      <div className="w-full h-1 bg-gray-200"></div>
      {card.map((wordRow, index) => (
        <div key={index} className="flex flex-col items-center">
          <div>
            <span className="font-bold text-primary-600">{wordRow.wordText}</span>
            <span className=""> :: {wordRow.wordDefinition}</span>
          </div>
          {wordRow.wordImageUri && (
            <Image src={wordRow.wordImageUri} alt={wordRow.wordText} width={200} height={100}></Image>
          )}
        </div>
      ))}
    </div>
  )
}
