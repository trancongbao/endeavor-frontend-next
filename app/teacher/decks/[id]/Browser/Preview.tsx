import { Row } from '../page'
import { styleNewWord } from './styleNewWord'
import Image from 'next/image'
import Toggle from './Toggle'

export default function Preview({ card }: { card: Row[] }) {
  console.log('card: ', card)
  return (
    <div className="pl-3 flex flex-col items-center gap-3">
      <button className="self-end w-36 bg-orange-400 text-white  hover:bg-orange-300 hover:text-black py-2 px-4 rounded">
        Preview
      </button>
      <Toggle isChecked={true} onChange={() => {}} />
      <p
        className="text-center text-lg"
        dangerouslySetInnerHTML={{
          __html: styleNewWord(card[0].cardText),
        }}
      ></p>
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
