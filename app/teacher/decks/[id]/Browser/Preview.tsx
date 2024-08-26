import { Row } from '../page'
import { styleNewWord } from './styleNewWord'

export default function Preview({ card }: { card: Row[] }) {
  console.log('card: ', card)
  return (
    <div className="pl-3 flex flex-col">
      <p
        className="self-center text-center text-lg"
        dangerouslySetInnerHTML={{
          __html: styleNewWord(card[0].cardText),
        }}
      ></p>
      <hr></hr>
      {card.map((word, index) => (
        <div key={index} className="">
          <span className="font-bold text-primary-600">{word.wordText}</span>
          <span className=""> :: {word.wordDefinition}</span>
        </div>
      ))}
    </div>
  )
}
