import { Row } from '../page'
import { styleNewWord } from './styleNewWord'

export default function Preview({ card }: { card: Row[] }) {
  console.log('card: ', card)
  return (
    <div className="pl-3 flex flex-col">
      <p
        className="self-center text-center text-lg"
        dangerouslySetInnerHTML={{
          __html: card ? styleNewWord(card[0].cardText) : '',
        }}
      ></p>
      <hr></hr>
      {card &&
        card.map((word, index) => (
          <div key={index} className="">
            <span className="">{word.wordText} </span>
            <span className="">:: {word.wordDefinition}</span>
          </div>
        ))}
    </div>
  )
}
