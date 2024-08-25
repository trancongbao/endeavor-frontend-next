import { Row } from '../page'
import { styleNewWord } from './styleNewWord'

export default function Preview({ card }: { card: Row[] }) {
  console.log('card: ', card)
  return (
    <div className="pl-3 flex flex-col">
      <p
        className="self-center text-lg"
        dangerouslySetInnerHTML={{
          __html: card ? styleNewWord(card[0].cardText) : '',
        }}
      ></p>
      <hr></hr>
      {/* {card &&
        card.map((word, index) => (
          <div key={index} className="back-section item">
            <div>
              <span className="word bold-text">{word.word_word} </span>
              <span className="definition">:: {word.word_definition}</span>
            </div>
          </div>
        ))} */}
    </div>
  )
}
