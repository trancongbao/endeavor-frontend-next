import { Row } from '../../page'
import { styleNewWord } from '../styleNewWord'
import Image from 'next/image'

export default function Preview({ selectedCardRows }: { selectedCardRows: Row[] }) {
  console.log('selectedCardRows: ', selectedCardRows)
  return (
    <div className="w-full pl-3 flex flex-col items-center gap-3">
      <p
        className="text-center text-lg"
        dangerouslySetInnerHTML={{
          __html: styleNewWord(selectedCardRows[0].cardText as string),
        }}
      ></p>
      <div className="w-full h-1 bg-gray-200"></div>
      {selectedCardRows.map((wordRow, index) => (
        <div key={index} className="flex flex-col items-center">
          <div>
            <span className="font-bold text-primary-600">{wordRow.wordText}</span>
            <span className=""> :: {wordRow.wordDefinition}</span>
          </div>
          {wordRow.wordImageUri && (
            <Image src={wordRow.wordImageUri} alt={wordRow.wordText as string} width={200} height={100}></Image>
          )}
        </div>
      ))}
    </div>
  )
}
